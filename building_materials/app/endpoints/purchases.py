

from copy import copy
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.models import Products, PurchaseItems, Purchases, Suppliers
from app.schemas import PurchaseCreate, User


router = APIRouter(prefix="/purchases", tags=["purchases"])

# Получение списка всех закупок


@router.get("/")
async def list_purchases(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "purchaser"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and purchasers can create products"
        )

    # Получаем все закупки с информацией о поставщике
    purchases = await Purchases.select(
        Purchases.all_columns(),
        Purchases.user_id.full_name
    )

    # Для каждой закупки получаем её позиции
    result = []
    for purchase in purchases:
        purchase_dict = copy(purchase)
        items = await PurchaseItems.select(
            PurchaseItems.all_columns(),
            PurchaseItems.product_id.all_columns(),
        ).where(PurchaseItems.purchase_id == purchase["id"])

        purchase_dict["items"] = items
        result.append(purchase_dict)

    return result


@router.get("/{purchase_id}")
async def get_purchase(purchase_id: int, current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "purchaser"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and purchasers can create products"
        )

    # Получаем все закупки с информацией о поставщике
    purchase = await Purchases.select(
        Purchases.all_columns(),
    ).where(Purchases.id == purchase_id).first()

    items = await PurchaseItems.select(
        PurchaseItems.all_columns(),
        PurchaseItems.product_id.all_columns(),
    ).where(PurchaseItems.purchase_id == purchase_id)

    purchase["items"] = items

    return purchase


@router.post("/")
async def create_purchase(
    purchase_data: PurchaseCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Создание новой закупки с позициями и обновление количества товаров
    (без использования транзакций)
    """
    # Проверка прав доступа
    if current_user.role not in ["admin", "purchaser"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and purchasers can create purchases"
        )

    current_time = datetime.now().time()
    result_datetime = datetime.combine(
        purchase_data.purchase_date, current_time)
    try:
        # 1. Создаем запись о закупке
        purchase = await Purchases(
            user_id=current_user.id,
            purchase_date=result_datetime
        ).save()

        # 2. Добавляем позиции закупки и обновляем количество товаров
        for item in purchase_data.items:
            # Проверяем существование товара
            product = await Products.objects().get(Products.id == item.product_id)
            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product with id {item.product_id} not found"
                )

            # Создаем позицию закупки
            await PurchaseItems(
                purchase_id=purchase[0]["id"],
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=item.unit_price
            ).save()

            # Обновляем количество товара
            await Products.update({
                Products.current_quantity: Products.current_quantity + item.quantity
            }).where(Products.id == item.product_id).run()

        return {'details': "ok"}

    except Exception as e:
        # В случае ошибки нет автоматического отката изменений
        raise HTTPException(
            status_code=400,
            detail=f"Error creating purchase: {str(e)}"
        )
