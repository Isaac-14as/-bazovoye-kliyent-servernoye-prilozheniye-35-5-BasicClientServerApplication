from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class Token(BaseModel):
    access_token: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    username: str = Field(...)
    full_name: str = Field(...)
    role: str = Field(..., regex="^(admin|purchaser|seller)$")


class UserCreate(UserBase):
    password: str = Field(...)


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class SupplierBase(BaseModel):
    name: str = Field(..., max_length=100)
    phone: str = Field(..., max_length=20)


class SupplierCreate(SupplierBase):
    pass


class Supplier(SupplierBase):
    id: int

    class Config:
        orm_mode = True


class ProductBase(BaseModel):
    name: str = Field(..., max_length=100)
    unit: str = Field(..., max_length=20)
    purchase_price: float = Field(..., gt=0)
    selling_price: float = Field(..., gt=0)
    current_quantity: int = Field(..., ge=0)


class ProductCreate(ProductBase):
    supplier_id: int = Field(..., gt=0)


class Product(ProductBase):
    id: int
    supplier_id: int

    class Config:
        orm_mode = True


class PurchaseItemBase(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)


class PurchaseItemCreate(PurchaseItemBase):
    pass


class PurchaseItem(PurchaseItemBase):
    id: int
    purchase_id: int

    class Config:
        orm_mode = True


class PurchaseBase(BaseModel):
    supplier_id: int = Field(..., gt=0)
    purchase_date: Optional[datetime] = None


class PurchaseCreate(PurchaseBase):
    items: List[PurchaseItemCreate] = Field(..., min_items=1)


class Purchase(PurchaseBase):
    id: int
    user_id: int
    items: List[PurchaseItem] = []

    class Config:
        orm_mode = True


class SaleItemBase(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)


class SaleItemCreate(SaleItemBase):
    pass


class SaleItem(SaleItemBase):
    id: int
    sale_id: int

    class Config:
        orm_mode = True


class SaleBase(BaseModel):
    sale_date: Optional[datetime] = None


class SaleCreate(SaleBase):
    items: List[SaleItemCreate] = Field(..., min_items=1)


class Sale(SaleBase):
    id: int
    user_id: int
    items: List[SaleItem] = []

    class Config:
        orm_mode = True


class ProductWithSupplier(Product):
    supplier: Supplier

    class Config:
        orm_mode = True


class PurchaseWithDetails(Purchase):
    supplier: Supplier
    user: User
    items: List[PurchaseItem]


class SaleWithDetails(Sale):
    user: User
    items: List[SaleItem]
