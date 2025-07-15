"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Your main express app file
const db_1 = require("../config/db");
const models_1 = require("../models");
const Product_1 = __importDefault(require("../models/mongo/Product"));
const mongoose_1 = __importDefault(require("mongoose"));
// This is a simplified test. A real test would require more setup/teardown.
describe('POST /api/orders', () => {
    let token;
    let userId;
    let productId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a test user and get a token
        yield models_1.User.destroy({ where: { email: 'test@example.com' } });
        const user = yield models_1.User.create({ name: 'Test User', email: 'test@example.com', passwordHash: 'password123' });
        userId = user.id;
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });
        token = res.body.token;
        // Create a test product
        const product = yield Product_1.default.create({ name: 'Test Book', description: 'A book for testing', price: 10, category: 'Books', stock: 100 });
        productId = product._id.toString();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield models_1.User.destroy({ where: { id: userId } });
        yield Product_1.default.findByIdAndDelete(productId);
        yield db_1.sequelize.close();
        yield mongoose_1.default.connection.close();
    }));
    it('should create an order successfully with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
            cartItems: [{ productId: productId, quantity: 2 }]
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.totalAmount).toEqual('20.00');
    }));
    it('should fail if not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/orders')
            .send({
            cartItems: [{ productId: productId, quantity: 1 }]
        });
        expect(res.statusCode).toEqual(401);
    }));
});
