const UsersService = require('../services/users.service');
const { getPagination, getPagingData } = require('../utils/helpers');

const UserService = new UsersService();

const getUsers = async (request, response, next) => {
  try {
    const admin = request.admin

    if(!admin) return response.status(401).json({ message: 'Unauthorized' });

    let query = request.query;
    let { page, size } = query;
    const { limit, offset } = getPagination(page, size, '10');
    query.limit = limit;
    query.offset = offset;

    let users = await UserService.findAndCount(query);
    const results = getPagingData(users, page, limit);
    return response.json({ results: results });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (request, response, next) => {
  try {
    const admin = request.admin
    const sameUser = request.sameUser
    let scope = 'public'
    let { id } = request.params;
    let userId = request.user.id;
    if (userId !== id && !admin ) 
      return response.status(401).json({ message: 'Unauthorized' })

    scope = 'admin'
    
    let user = await UserService.getUser(id, scope);
    return response.json({ results: user });
   
  } catch (error) {
    next(error);
  }
};

const getMyUser = async (request, response, next) => {
  try {
    let { id } = request.user.id;
    let user = await UserService.getUser(id);
    return response.json({ results: user });
  } catch (error) {
    next(error);
  }
};

const patchUser = async (request, response, next) => {
  try {
    let { id } = request.user.id;
    let { body } = request;
    let user = await UserService.updateUser(id, body);
    return response.json({ results: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getMyUser,
  patchUser,
};
