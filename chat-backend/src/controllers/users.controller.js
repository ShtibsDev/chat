/** @import {FastifyRequest, FastifyReply} from 'fastify' */
/** @import {UserCreateModel} from '../models/user.model.js' */
/** @import {LoginModel} from '../models/login.model.js' */
/** @import {ObjectId} from 'mongodb' */
/** @import {UserModel} from '../schemas/user.schema.js' */

import { Chat } from '../schemas/chat.schema.js';
import { User } from '../schemas/user.schema.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * @param {string} email
 * @returns {Promise<UserModel>}
 *  */
export async function getUserByEmail(email) {
	const user = await User.findOne({ email }).lean();
	return user;
}

/**
 * @param {FastifyRequest<{Body: LoginModel}>} req
 * @param {FastifyReply} res
 */
export async function login(req, res) {
	const { email, password } = req.body;

	/** @type {import('../schemas/user.schema.js').UserModel} */
	const user = await User.findOne({ email }).lean();
	const isMatch = !!user && (await bcrypt.compare(password, user.password));

	if (!isMatch) return res.code(401).send({ message: 'Invalid email or password' });

	const { password: pass, ...payload } = user;

	const token = req.jwt.sign(payload);
	res.setCookie('access_token', token, { path: '/', httpOnly: true, secure: true });

	return { accessToken: token };
}

/**
 * @param {FastifyRequest} _req
 * @param {FastifyReply} res
 */
export function logout(_req, res) {
	res.clearCookie('access_token');
	return { message: 'Successfully logged out' };
}

/**
 * @param {FastifyRequest} req
 */
export function getUser(req) {
	return User.findOne({ email: req.user.email }).lean();
}

export async function getUsers() {
	/** @type {Omit<UserModel, 'chats'>[]} */
	const users = await User.find({}, '_id name email').lean();
	return users;
}

/**
 * @param {FastifyRequest<{Body: UserCreateModel}>} req
 * @param {FastifyReply} res
 */
export async function createUser(req, res) {
	const existing = await User.findOne({ email: req.body.email }).lean();
	if (existing) throw new Error('User already exists');

	const password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
	const user = new User({ ...req.body, password });
	await user.save();

	res.code(201).send(user);
}
