from pony.orm import db_session
from app import db
from models.User import User, UserSchema


db.drop_all_tables(with_all_data=True)
db.create_tables()

with db_session():



    schema = UserSchema()



    User(
    username='Admin',
    email='Tomjhinton@gmail.com',
    password_hash=schema.generate_hash('pass'),
    dollars=100.0,
    bitcoin=0.0,
    ethereum=0.0,
    ripple=0.0,
    tether=0.0,
    bitcoin_cash=0.0,
    litecoin=0.0,
    eos=0.0,
    binance_coin=0.0,
    bitcoin_sv=0.0,
    cosmos=0.0,
    tezos=0.0,
    stellar=0.0,
    cardano=0.0,
    tron=0.0,
    unus_sed_leo=0.0,
    monero=0.0,
    huobi_token=0.0,
    chainlink=0.0,
    neo=0.0,
    maker=0.0,
    ),









    db.commit()
