--------------------------------------------------------------------
Server Setup (24 APIS , 7 Tables)
--------------------------------------------------------------------
-> npm init --yes
-> tsc --init
-> npm install @types/bcryptjs @types/cors @types/dotenv @types/express @types/express-validator @types/gravatar @types/jsonwebtoken @types/mongoose @types/node bcryptjs cors dotenv express express-validator gravatar jsonwebtoken mongoose@6.7.3 nodemon ts-node typescript
-> mongoose@6.7.3
USER ROUTER 
------------
/**
 * @usage : Register a User
 * @url : http://localhost:9000/api/users/register
 * @body : username , email , password
 * @method : POST
 * @access : PUBLIC
 */
 
 /**
 * @usage : Login a User
 * @url : http://localhost:9000/api/users/login
 * @body : email , password
 * @method : POST
 * @access : PUBLIC
 */
 
 /**
 *  @usage : get users Data
 *  @url : http://localhost:9000/api/users/me
 *  @method : GET
 *  @param : no-params
 *  @access : PRIVATE
 */
 
 /**
 * @usage : update profile Picture
 * @url : http://localhost:9000/api/users/profile
 * @body : imageUrl
 * @method : POST
 * @access : PRIVATE
 */
 
 /**
 * @usage : change the password
 * @url : http://localhost:9000/api/users/change-password
 * @body : password
 * @method : POST
 * @access : PRIVATE
 */
 
 ADDRESS ROUTER 
 --------------
 /**
 * @usage : Create New Address
 * @url : http://localhost:9000/api/addresses/new
 * @body : mobile,address,landmark,street,city,state,country,pinCode
 * @method : POST
 * @access : PRIVATE
 */
 
 /**
 * @usage : Update Address
 * @url : http://localhost:9000/api/addresses/:addressId
 * @body : mobile,address,landmark,street,city,state,country,pinCode
 * @method : PUT
 * @access : PRIVATE
 */
 
 /**
 * @usage : Get Address
 * @url : http://localhost:9000/api/addresses/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 
 /**
 * @usage : Delete Address
 * @url : http://localhost:9000/api/addresses/:addressId
 * @body : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
 
 CATEGORY ROUTER 
 ----------------
 /**
 * @usage : Create a Category
 * @url : http://localhost:9000/api/categories/
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
 
  
 /**
 * @usage : Create a Sub Category
 * @url : http://localhost:9000/api/categories/:categoryId
 * @body : name, description
 * @method : POST
 * @access : PRIVATE
 */
 
 /**
 * @usage : Get all categories
 * @url : http://localhost:9000/api/categories/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 
 PRODUCT ROUTER 
 ---------------
 /**
 * @usage : Create a Product
 * @url : http://localhost:9000/api/products/
 * @body : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : POST
 * @access : PRIVATE
 */
  
 
 /**
 * @usage : Update a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : title, description, imageUrl, brand, price, quantity, categoryId, subCategoryId
 * @method : PUT
 * @access : PRIVATE
 */
 
 /**
 * @usage : Get all Products
 * @url : http://localhost:9000/api/products/
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 
 /**
 * @usage : Get a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 
 /**
 * @usage : Delete a Product
 * @url : http://localhost:9000/api/products/:productId
 * @body : no-params
 * @method : DELETE
 * @access : PRIVATE
 */
 
 /**
 * @usage : Get all products with category Id
 * @url : http://localhost:9000/api/products/categories/:categoryId
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */

CART ROUTER 
-----------
/**
 * @usage : create a Cart
 * @url : http://localhost:9000/api/carts/
 * @body :products[{product, count,price}],total,tax,grandTotal
 * @method : POST
 * @access : PRIVATE
 */
 
 /**
 * @usage : get Cart Info
 * @url : http://localhost:9000/api/carts/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 
 ORDER ROUTER 
 ------------
 /**
 * @usage : place an order
 * @url : http://localhost:9000/api/orders/place
 * @body : products[{product, count,price}],total,tax,grandTotal,paymentType
 * @method : POST
 * @access : PRIVATE
 */
 
 
 /**
 * @usage : get all orders
 * @url : http://localhost:9000/api/orders/all
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
  
 
 /**
 * @usage : get my orders
 * @url : http://localhost:9000/api/orders/me
 * @body : no-params
 * @method : GET
 * @access : PRIVATE
 */
 
 /**
 * @usage : update order status
 * @url : http://localhost:9000/api/orders/:orderId
 * @body : orderStatus
 * @method : POST
 * @access : PRIVATE
 */


--------------------------------------------------------------------
DB Setup
--------------------------------------------------------------------
Database : react-e-commerce
Tables : users, products, carts, orders, categories, addresses

Users Table 
-----------
_id?: string;
username?: string;
imageUrl: string;
isAdmin?: boolean;
isSuperAdmin?: boolean;
email: string;
password: string;
createdAt?: Date;
updatedAt?: Date;

Addresses Table 
----------------
_id?: string;
name: string;
email: string;
mobile: string;
flat: string;
landmark: string;
street: string;
city: string;
state: string;
country: string;
pinCode: string;
userObj: mongoose.Schema.Types.ObjectId;
createdAt?: Date;
updatedAt?: Date;

Products Table 
---------------
_id?: string;
title: string;
description: string;
imageUrl: string;
brand: string;
price: number;
quantity: number;
sold?: number;
userObj: mongoose.Schema.Types.ObjectId;
categoryObj: mongoose.Schema.Types.ObjectId;
subCategoryObj: mongoose.Schema.Types.ObjectId;
createdAt?: Date;
updatedAt?: Date;

Categories Table 
-----------------
_id?: string;
name: string;
description: string;
subCategories: [
{
	 _id?: string;
	name: string;
	description: string;
}
],
createdAt?: Date;
updatedAt?: Date;

/* Carts Table
-----------
_id?: string;
products: [
{
	 _id: string;
    title: string;
    description: string;
    imageUrl: string;
    brand: string;
    price: string;
    quantity: string;
    count: number;
    sold: number;
    categoryObj?: {
		_id: string;
		name: string;
		description: string;
		subCategories?: (string)[] | null;
		createdAt: string;
		updatedAt: string;
	};
    subCategoryObj?: {
		 _id: string;
		name: string;
		description: string;
		__v: number;
	};
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
];
total: string;
tax: string;
grandTotal: string;
userObj: mongoose.Schema.Types.ObjectId;
createdAt?: Date;
updatedAt?: Date; */

Cart
----
products: [
	{
	product : ObjectId,
	count: number,
	price: number
	}
],
total: number,
tax: number,
grandTotal: number,
orderBy: ObjectId

Orders Table
-----------
_id?: string;
products: [
{
	 _id: string;
    title: string;
    description: string;
    imageUrl: string;
    brand: string;
    price: string;
    quantity: string;
    count: number;
    sold: number;
    categoryObj?: {
		_id: string;
		name: string;
		description: string;
		subCategories?: (string)[] | null;
		createdAt: string;
		updatedAt: string;
	};
    subCategoryObj?: {
		 _id: string;
		name: string;
		description: string;
		__v: number;
	};
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
];
total: string;
tax: string;
grandTotal: string;
paymentType: string;
orderStatus?: string,
orderBy: mongoose.Schema.Types.ObjectId;
createdAt?: Date;
updatedAt?: Date;

--------------------------------------
Order of Table Operations
--------------------------------------
Users 
Address 
Categories 
Products
Cart 
Orders  
