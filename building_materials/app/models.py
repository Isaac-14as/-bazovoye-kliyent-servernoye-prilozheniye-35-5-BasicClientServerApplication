from piccolo.table import Table
from piccolo.columns import (
    Varchar,
    Integer,
    Numeric,
    Timestamp,
    Boolean,
    ForeignKey,
    UUID,
    Text
)
from piccolo.columns.defaults.timestamp import TimestampNow
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    PURCHASER = "purchaser"
    SELLER = "seller"


class Users(Table):
    username = Varchar(length=255, unique=True)
    password_hash = Varchar(length=255)
    full_name = Varchar(length=255)
    role = Varchar(length=20)


# Поставщики
class Suppliers(Table):
    name = Varchar(length=100)
    phone = Varchar(length=20)
    created_at = Timestamp(default=TimestampNow())

# Товары


class Products(Table):
    name = Varchar(length=100)
    supplier_id = ForeignKey(Suppliers)
    unit = Varchar(length=20)  # шт, кг, м и т.д.
    selling_price = Numeric(digits=(10, 2))
    current_quantity = Integer(default=0)
    created_at = Timestamp(default=TimestampNow())

# Закупки


class Purchases(Table):
    supplier_id = ForeignKey(Suppliers)
    user = ForeignKey(Users)  # Кто оформил закупку
    purchase_date = Timestamp(default=TimestampNow())

# Позиции закупок


class PurchaseItems(Table):
    purchase = ForeignKey(Purchases)
    product = ForeignKey(Products)
    quantity = Integer()
    unit_price = Numeric(digits=(10, 2))

# Продажи


class Sales(Table):
    user = ForeignKey(Users)  # Кто оформил продажу
    sale_date = Timestamp(default=TimestampNow())
    client_name = Varchar(length=100, null=True)

# Позиции продаж


class SaleItems(Table):
    sale = ForeignKey(Sales)
    product = ForeignKey(Products)
    quantity = Integer()
