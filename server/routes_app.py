# ITC530 project
# Team members
# Sardar Thafzil Ahamed (sarda2t)
# Padmaraju Yaswini (padma1y)
# Sai Kiran Debbadi (debba1s)
# Sri Srujani Kandula (kandu3s)
# Riad Hossain (hossa1r)

# Importing required packages
from flask import Flask, Response, request, send_file, jsonify, url_for, redirect, make_response
from pymongo import MongoClient
import bcrypt
from flask_cors import CORS
import barcode
from barcode import Code128
from barcode.writer import ImageWriter
import qrcode
import io
import pandas as pd
from io import BytesIO
import pybase64
import cv2
from pyzbar.pyzbar import decode
from PIL import Image
import numpy as np

app = Flask(__name__)
app.secret_key = "thafzil"
# making the app to access from all origins
CORS(app)

# MongoDB configuration (key: thafzil)


def MongoDB():
    # created the MongoDB project and adding the connection here
    # Adding mongoclient (python package)
    # Created a project called Barqrgenerator
    # And created a cluster0 in the project
    client = MongoClient(
        "mongodb+srv://sarda2t:Mobilecomputing123%40@cluster0.tlktwhi.mongodb.net/test")
    # Handling a single database to store user and image information
    database_itc530 = client.get_database('itc_530')
    user_records = database_itc530.user_records
    images_records = database_itc530.images_records
    # records = database_itc530.register
    # returning user and image records for the processing
    return user_records, images_records


def MongoDB_docker():
    client = MongoClient(host='test_mongodb',
                         port=27017,
                         username='miniproject1',
                         password='pass',
                         authSource="admin")
    # Handling a single database to store user and image information
    database_itc530 = client.get_database('itc_530')
    user_records = database_itc530.user_records
    images_records = database_itc530.images_records
    # records = database_itc530.register
    # returning user and image records for the processing
    return user_records, images_records

#  ------------- Comment the below line to run mongodb in docker container -------------
# user_records,images_records = MongoDB()


# ------------- Uncomment the below line to run mongodb in docker container and also comment the above line -------------
user_records, images_records = MongoDB_docker()


# -----API endpoints------

# API endpoint to add sign up of the user
@app.route("/", methods=['POST'])
def signup():

    message = ''
    if request.method == "POST":
        user = request.form.get("fullname")
        email = request.form.get("email")
        password1 = request.form.get("password1")
        password2 = request.form.get("password2")
        email_found = user_records.find_one({"email": email})
        if email_found:
            message = 'This email already exists in database'
            response = jsonify({'message': message})
            response.status_code = 401
            return response
        if password1 != password2:
            response = jsonify({'message': message})
            response.status_code = 401
            return response
        else:
            # hash the password and encode it
            hashed = bcrypt.hashpw(password2.encode('utf-8'), bcrypt.gensalt())
            # assing them in a dictionary in key value pairs
            user_input = {'name': user, 'email': email, 'password': hashed}
            # insert it in the record collection
            user_records.insert_one(user_input)
            # find the new created account and its email
            user_data = user_records.find_one({"email": email})
            new_email = user_data['email']
            name = user_data['name']
            # if registered redirect to logged in as the registered user
            response = jsonify({'email': new_email, 'name': name})
            response.status_code = 200
            return response
    response = jsonify({'message': 'Something went wrong!!'})
    response.status_code = 404
    return response

# API endpoint to chcek the username and password entered by the user


@app.route("/login", methods=["POST", "GET"])
def login():
    message = 'Please login to your account'

    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        # Cheking whether the user is already added to db or not
        email_found = user_records.find_one({"email": email})
        if email_found:
            email_val = email_found['email']
            passwordcheck = email_found['password']
            name_val = email_found['name']
            # Encoding the password since the encoded is saved in the Database and check if it matches
            if bcrypt.checkpw(password.encode('utf-8'), passwordcheck):
                response = jsonify({'email': email_val, 'name': name_val})
                response.status_code = 200
                return response
            else:
                response = jsonify({'message': 'wrong_password_err'})
                response.status_code = 401
                return response
        else:
            response = jsonify({'message': 'email_not_found_err'})
            response.status_code = 401
            return response
    response = jsonify({'message': message})
    response.status_code = 401
    return response

# API endpoint to get the count of images saved to the database for that particular user


@app.route("/get_saved_count", methods=['POST'])
def get_count():
    user = request.json.get('user')
    images_count = 0
    for doc in images_records.find({'user': user}):
        images_count += len(doc.get('images', []))
    response = jsonify({'count': images_count})
    response.status_code = 200
    return response

# # API endpoint to save the image to the database (user specific)


@app.route('/save_to_db', methods=['POST'])
def save_to_db():
    user = request.json.get('user')
    images = request.json.get('images')
    existing_images = []
    # check if a document for the given user exists already
    existing_doc = images_records.find_one({'user': user})
    if existing_doc:
        existing_images = existing_doc['images']
    # Logic to filter the images that are new from the requested images
    new_images = [image for image in images if (image['name'], image['type']) not in [(
        existing_image['name'], existing_image['type']) for existing_image in existing_images]]
    # if there are any new images, add them to the database
    if new_images:
        # if the document already exists, update it
        if existing_doc:
            images_records.update_one(
                {'user': user}, {'$push': {'images': {'$each': new_images}}})
        # if the document does not exist, create a new doc with the requested images
        else:
            images_records.insert_one({'user': user, 'images': new_images})

        response = jsonify(
            {'message': f"{len(new_images)} new image/s uploaded to the database successfully for your future reference"})
        response.status_code = 200
    else:
        response = jsonify(
            {'message': 'This image is already uploaded to the database'})
        response.status_code = 200

    return response

# API endpoint to delete image data from the user's database


@app.route('/delete_from_db', methods=['POST'])
def delete_from_db():
    user = request.json.get('user')
    image_name = request.json.get('image_name')
    image_type = request.json.get('image_type')

    # find the document for the given user
    existing_doc = images_records.find_one({'user': user})
    # finding the given image in the user images list
    if existing_doc:
        existing_image = next(
            (image for image in existing_doc['images'] if image['name'] == image_name and image['type'] == image_type), None)
        if existing_image:
            existing_doc['images'].remove(existing_image)
            images_records.replace_one({'user': user}, existing_doc)
            response = jsonify({'message': 'Image deleted from your database'})
            response.status_code = 200
        else:
            response = jsonify(
                {'message': 'This image not found in your database'})
            response.status_code = 404
    return response

# API endpoint to delete all images from the user's database


@app.route('/delete_all_images', methods=['POST'])
def delete_all_images():
    user = request.json.get('user')
    existing_doc = images_records.find_one({'user': user})
    if existing_doc:
        existing_doc['images'] = []
        images_records.replace_one({'user': user}, existing_doc)
        response = jsonify(
            {'message': 'All image/s deleted from your database'})
        response.status_code = 200
    return response


# API endpoint to get the images names that are saved by the logged in user
@app.route('/get_from_db', methods=['POST'])
def get_from_db():
    # Find all documents that match the given user
    # Since images are saved in bulk mode, we are dealing with list
    matching_docs = list(images_records.find(
        {"user": request.json.get('user')}))
    # Merge all images from matching documents
    merged_images = []
    images = []
    for doc in matching_docs:
        merged_images += doc['images']
    for value in merged_images:
        # Get the text input from the client
        if value['type'] == 'bar':
            text = value['name']
            if not text:
                return Response(status=400)
            # Generate the barcode image and add it to the array
            barcode = Code128(text, writer=ImageWriter())
            buffer = BytesIO()
            barcode.write(buffer)
            img_data = pybase64.b64encode(buffer.getvalue()).decode('utf-8')
            images.append(
                {'name': text, 'image': img_data, 'type': value['type']})
        if value['type'] == 'qr':
            text = value['name']
            if not text:
                return Response(status=400)
            # Generate the QR code image and add it to the array
            qr = qrcode.QRCode(version=1, box_size=10, border=4)
            qr.add_data(text)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            buffer.seek(0)
            img_data = pybase64.b64encode(buffer.getvalue()).decode('utf-8')
            images.append(
                {'name': text, 'image': img_data, 'type': value['type']})
    # Return the merged images as a response
    response = jsonify(images)
    response.status_code = 200
    return response

# API endpoint to generate barcode for a given text


@app.route('/barcode', methods=['POST'])
def generate_barcode():
    # Extract text from the request (client)
    text = request.json.get('text')
    if not text:
        return Response(status=400)
    # Generate the barcode image
    barcode = Code128(text, writer=ImageWriter())
    buffer = BytesIO()
    barcode.write(buffer)
    return Response(buffer.getvalue(), mimetype='image/png')

# API endpoint to generate QR code for a given text


@app.route('/qrcode', methods=['POST'])
def generate_qrcode():
    # Extract text from the request (client)
    data = request.json['text']
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return send_file(buffer, mimetype='image/png')

# API endpoint to get barcode for a given csv file


@app.route('/barcode_csv', methods=['POST'])
def generate_barcodes():
    # Read the CSV file into a DataFrame
    df = pd.read_csv(request.files.get('csv_file'),
                     header=None, index_col=None)
    # Stack the columns into a single column
    df = df.stack().reset_index(drop=True)
    df = df.head(100)
    images = []
    # Iterate over each value in the DataFrame
    for value in df.values:
        # Get the text input from the client
        text = value
        if not text:
            return Response(status=400)
        # Generate the barcode image and add it to the array
        barcode = Code128(text, writer=ImageWriter())
        buffer = BytesIO()
        barcode.write(buffer)
        img_data = pybase64.b64encode(buffer.getvalue()).decode('utf-8')
        images.append({'name': text, 'image': img_data})
    # Return the array of pybase64-encoded PNG images as a response
    return jsonify(images)

# API endpoint to get qr code for a given csv file


@app.route('/qrcode_csv', methods=['POST'])
def generate_qrcodes():
    # Read the CSV file into a DataFrame
    df = pd.read_csv(request.files.get('csv_file'),
                     header=None, index_col=None)
    # Stack the columns into a single column
    df = df.stack().reset_index(drop=True)
    df = df.head(100)
    images = []
    # Iterate over each value in the DataFrame
    for value in df.values:
        # Get the text input from the client
        text = value
        if not text:
            return Response(status=400)
        # Generate the QR code image and add it to the array
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(text)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        img_data = pybase64.b64encode(buffer.getvalue()).decode('utf-8')
        images.append({'name': text, 'image': img_data})
    # Return the array of pybase64-encoded PNG images as a response
    return jsonify(images)

# API endpoint to decode the barcodes


@app.route('/decode_barcode', methods=['POST'])
def decode_barcodes():
    decoded_string = ''
    # Extracting the image file from the given file from the client
    image_data = request.files['image'].read()
    img_local = Image.open(BytesIO(image_data))
    img = cv2.cvtColor(np.array(img_local), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    # Find contours in the binary image
    contours, _ = cv2.findContours(
        binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # Loop over the contours and decode any Code 128 barcodes
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        roi = binary[y:y+h, x:x+w]
        # Decode the barcode using pyzbar
        decoded_objs = decode(roi)
        # Loop over the decoded objects and print their data
        for obj in decoded_objs:
            decoded_string += obj.data.decode('utf-8')

    response = jsonify({'decoded': decoded_string})
    response.status_code = 200
    return response

# API endpoint to decode the QR code


@app.route('/decode_qrcode', methods=['POST'])
def decode_qrcodes():

    # Get the image data from the request
    image_data = request.files['image'].read()
    img_array = np.asarray(bytearray(image_data), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    # Create a QR code detector object
    qr_detector = cv2.QRCodeDetector()
    # Detect and decode the QR code
    data, bbox, _ = qr_detector.detectAndDecode(img)
    # If a QR code was detected, print the data
    if bbox is not None:
        response = jsonify({'decoded': data})
        response.status_code = 200
        return response
    else:
        response = jsonify({'decoded': ''})
        response.status_code = 200
        return response
