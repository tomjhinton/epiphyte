from datetime import datetime, timedelta
import jwt
import bcrypt

from pony.orm import Required, Set, Optional
from marshmallow import Schema, fields, post_load, validates_schema, ValidationError
from app import db



class Wallet(db.Entity):
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










class WalletSchema(Schema):
    id = fields.Int(dump_only=True)
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
