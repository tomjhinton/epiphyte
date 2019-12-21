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
    bitcoin=2.0,
    ethereum=2.0,
    ripple=2.0,
    tether=2.0,
    bitcoin_cash=2.0,
    litecoin=2.0,
    eos=2.0,
    binance_coin=2.0,
    bitcoin_sv=2.0,
    cosmos=2.0,
    tezos=2.0,
    stellar=2.0,
    cardano=2.0,
    tron=2.0,
    unus_sed_leo=2.0,
    monero=2.0,
    huobi_token=2.0,
    chainlink=2.0,
    neo=2.0,
    maker=2.0,
    ),









    db.commit()
