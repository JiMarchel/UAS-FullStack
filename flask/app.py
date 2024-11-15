from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Konfigurasi database menggunakan MySQL Connector
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password@localhost/jimmy'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "jwt_secret_key"

db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    alquran_bookmarks = db.relationship('Alquran_Bookmarks', back_populates='user', cascade="all, delete-orphan")
    doa_bookmarks = db.relationship('Doa_Bookmarks', back_populates='user', cascade="all, delete-orphan")

class Alquran_Bookmarks(db.Model):
    __tablename__ = 'alquran_bookmarks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    alquran_id = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', back_populates='alquran_bookmarks')

class Doa_Bookmarks(db.Model):
    __tablename__ = 'doa_bookmarks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    doa_id = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', back_populates='doa_bookmarks')


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "Username already exists"}), 409  # Conflict status code

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity={"id": user.id, "username": user.username})
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/alquran-bookmarks', methods=['POST'])
def toggle_bookmark():
    data = request.get_json()
    user_id = data.get("user_id")
    alquran_id = data.get("alquran_id")

    # Validasi input
    if not user_id or not alquran_id:
        return jsonify({"message": "User ID and Alquran ID are required"}), 400

    # Cari bookmark di database
    bookmark = Alquran_Bookmarks.query.filter_by(user_id=user_id, alquran_id=alquran_id).first()

    if bookmark:
        # Jika bookmark ditemukan, hapus dari database (toggle off)
        try:
            db.session.delete(bookmark)
            db.session.commit()
            return jsonify({"message": "Bookmark removed"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    else:
        # Jika bookmark tidak ditemukan, tambahkan ke database (toggle on)
        new_bookmark = Alquran_Bookmarks(user_id=user_id, alquran_id=alquran_id)
        try:
            db.session.add(new_bookmark)
            db.session.commit()
            return jsonify({"message": "Bookmark added"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


@app.route('/doa-bookmarks', methods=['POST'])
def toggle_doa_bookmarks():
    data = request.get_json()
    user_id = data.get("user_id")
    doa_id = data.get("doa_id")

    # Validasi input
    if not user_id or not doa_id:
        return jsonify({"message": "User ID and Doa ID are required"}), 400

    # Cari bookmark di database
    bookmark = Doa_Bookmarks.query.filter_by(user_id=user_id, doa_id=doa_id).first()

    if bookmark:
        # Jika bookmark ditemukan, hapus dari database (toggle off)
        try:
            db.session.delete(bookmark)
            db.session.commit()
            return jsonify({"message": "Bookmark removed"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    else:
        # Jika bookmark tidak ditemukan, tambahkan ke database (toggle on)
        new_bookmark = Doa_Bookmarks(user_id=user_id, doa_id=doa_id)
        try:
            db.session.add(new_bookmark)
            db.session.commit()
            return jsonify({"message": "Bookmark added"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@app.route('/alquran-bookmarks/<int:user_id>', methods=['GET'])
def get_user_alquran_bookmarks(user_id):
    bookmarks = Alquran_Bookmarks.query.filter_by(user_id=user_id).all()

    results = [
        {
            "id": bookmark.id,
            "user_id": bookmark.user_id,
            "alquran_id": bookmark.alquran_id
        } for bookmark in bookmarks
    ]
    return jsonify(results), 200

@app.route('/doa-bookmarks/<int:user_id>', methods=['GET'])
def get_user_doa_bookmarks(user_id):
    bookmarks = Doa_Bookmarks.query.filter_by(user_id=user_id).all()

    results = [
        {
            "id": bookmark.id,
            "user_id": bookmark.user_id,
            "doa_id": bookmark.doa_id
        } for bookmark in bookmarks
    ]
    return jsonify(results), 200

if __name__ == '__main__':
    # Run the app in debug mode on port 5000
    app.run(debug=True, port=5000)
