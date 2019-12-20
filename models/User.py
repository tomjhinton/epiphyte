from datetime import datetime, timedelta
import jwt
import bcrypt

from pony.orm import Required, Set, Optional
from marshmallow import Schema, fields, post_load, validates_schema, ValidationError
from app import db
from config.environment import secret


class User(db.Entity):
    username = Required(str, unique=True)
    email = Required(str, unique=True)
    password_hash = Required(str)
    dollars = Required(float)
    bitcoin = Required(float)
    ethereum = Required(float)
    ripple = Required(float)
    tether = Required(float)
    bitcoin_cash = Required(float)
    litecoin = Required(float)
    eos = Required(float)
    binance_coin = Required(float)
    bitcoin_sv = Required(float)
    cosmos = Required(float)
    tezos = Required(float)
    stellar = Required(float)
    cardano = Required(float)
    tron = Required(float)
    unus_sed_leo = Required(float)
    monero = Required(float)
    huobi_token = Required(float)
    chainlink = Required(float)
    neo = Required(float)
    maker = Required(float)



    def is_password_valid(self, plaintext):
        return bcrypt.checkpw(plaintext.encode('utf8'), self.password_hash.encode('utf8'))

    def generate_token(self):
        payload = {
            'exp': datetime.utcnow() + timedelta(hours=6),
            'iat': datetime.utcnow(),
            'sub': self.id
        }

        token = jwt.encode(
            payload,
            secret,
            'HS256'
        ).decode('utf8')

        return token
    ##following






class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(load_only=True)
    password_confirmation = fields.Str(load_only=True)
    dollars = fields.Float(required=True)
    bitcoin = fields.Float(required=True)
    ethereum = fields.Float(required=True)
    ripple = fields.Float(required=True)
    tether = fields.Float(required=True)
    bitcoin_cash = fields.Float(required=True)
    litecoin = fields.Float(required=True)
    eos = fields.Float(required=True)
    binance_coin = fields.Float(required=True)
    bitcoin_sv = fields.Float(required=True)
    cosmos = fields.Float(required=True)
    tezos = fields.Float(required=True)
    stellar = fields.Float(required=True)
    cardano = fields.Float(required=True)
    tron = fields.Float(required=True)
    unus_sed_leo = fields.Float(required=True)
    monero = fields.Float(required=True)
    huobi_token = fields.Float(required=True)
    chainlink = fields.Float(required=True)
    neo = fields.Float(required=True)
    maker = fields.Float(required=True)



    # basic method
    def generate_hash(self, plaintext):
        return bcrypt.hashpw(plaintext.encode('utf8'), bcrypt.gensalt(8)).decode('utf8')

    # validate schema allows for custom error messages
    @validates_schema
    def check_passwords(self, data):
        if data['password'] and data['password'] != data['password_confirmation']:
            raise ValidationError(
                field_name='password_confirmation',
                message=['Does not match']
            )


    @validates_schema
    def validate_username(self, data):
        user = User.get(username=data.get('username'))

        if user:
            raise ValidationError(
                field_name='username',
                message=['Must be unique']
            )


    @validates_schema
    def validate_email(self, data):
        user = User.get(email=data.get('email'))

        if user:
            raise ValidationError(
                field_name='email',
                message=['Must be unique']
            )


    # logic to perform AFTER validation but before save, to modify the data
    @post_load
    def hash_password(self, data):
        if data['password']:
            data['password_hash'] = self.generate_hash(data['password'])

            del data['password']
            del data['password_confirmation']

        return data
