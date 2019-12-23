from flask import Blueprint, request, jsonify, abort
from pony.orm import db_session
from marshmallow import ValidationError
from app import db
from models.Wallet import Wallet, WalletSchema
from lib.secure_route import secure_route


router = Blueprint(__name__, 'wallets')

@router.route('/wallets', methods=['GET'])
@db_session
def index():
    schema = WalletSchema(many=True)
    wallets = Wallet.select()
    return schema.dumps(wallets)


@router.route('/wallets', methods=['POST'])
@db_session
def create():

    schema = WalletSchema()

    try:

        data = schema.load(request.get_json())

        wallet = Wallet(**data)

        db.commit()
    except ValidationError as err:

        return jsonify({'message': 'Validation failed', 'errors': err.messages}), 422

    return schema.dumps(wallet), 201


@router.route('/wallets/<int:wallet_id>', methods=['GET'])
@db_session
def show(wallet_id):
    schema = WalletSchema()
    wallet = Wallet.get(id=wallet_id)

    if not wallet:
        abort(404)

    return schema.dumps(wallet)


@router.route('/wallets/<int:wallet_id>', methods=['PUT'])
@db_session
def update(wallet_id):
    schema = WalletSchema()
    wallet = Wallet.get(id=wallet_id)

    if not wallet:
        abort(404)

    try:
        data = schema.load(request.get_json())
        wallet.set(**data)
        db.commit()
    except ValidationError as err:
        return jsonify({'message': 'Validation failed', 'errors': err.messages}), 422

    return schema.dumps(wallet)


@router.route('/wallets/<int:wallet_id>', methods=['DELETE'])
@db_session
@secure_route
def delete(wallet_id):
    wallet = Wallet.get(id=wallet_id)

    if not wallet:
        abort(404)

    wallet.delete()
    db.commit()

    return '', 204
