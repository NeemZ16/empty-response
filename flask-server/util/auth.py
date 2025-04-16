from util.database import user_collection
from flask_restful import Resource
from flask import request, jsonify

class Register(Resource):
    
    def post(self):
        data = request.get_json()
        
        username = data["username"]
        password = data["password"]

        print("Attempting to register user below:")
        print("Username: ", username)
        print("Password: ", password)

        return "to do", 501
class Login(Resource):


    def post(self):
        data = request.get_json()

        username = data["username"]
        password = data["password"]

        print("Username: ", username)
        print("Password: ", password)

        return jsonify({"message": f"Welcome, {username}!"})

        #return "to do", 501

class Logout(Resource):
    
    def post(self):
        data = request.get_json()

        print("Logging out")

        return jsonify({"message": "Logout successful"})

        #return "to do", 501
