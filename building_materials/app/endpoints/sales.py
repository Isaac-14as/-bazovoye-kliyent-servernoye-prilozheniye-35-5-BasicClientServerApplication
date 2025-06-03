

from copy import copy
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.models import Products, SaleItems, Sales
from app.schemas import SaleCreate, User


router = APIRouter(prefix="/sales", tags=["sales"])


# Получение списка продаж

@router.get("/")
async def list_sales(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "seller"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and sellers can create products"
        )

    sales = await Sales.select(
        Sales.all_columns(),
        Sales.user_id.full_name
    )

    # Для каждой закупки получаем её позиции
    result = []
    for sale in sales:
        sale_dict = copy(sale)
        items = await SaleItems.select(
            SaleItems.all_columns(),
            SaleItems.product_id.all_columns(),
        ).where(SaleItems.sale_id == sale["id"])

        sale_dict["items"] = items
        result.append(sale_dict)

    return result


@router.get("/{sale_id}")
async def get_sale(sale_id: int, current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "seller"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and sellers can create products"
        )

    sales = await Sales.select(
        Sales.all_columns(),
        Sales.user_id.full_name
    ).where(Sales.id == sale_id).first()

    items = await SaleItems.select(
        SaleItems.all_columns(),
        SaleItems.product_id.all_columns(),
    ).where(SaleItems.sale_id == sale_id)

    sales["items"] = items

    return sales


@router.post("/")
async def create_sale(
    sale_data: SaleCreate,  # Можно создать Pydantic модель для валидации, как PurchaseCreate
    current_user: User = Depends(get_current_user)
):
    """
    Создание новой продажи с позициями и обновление количества товаров
    """
    # Проверка прав доступа
    if current_user.role not in ["admin", "seller"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and sellers can create sales"
        )

    try:
        current_time = datetime.now().time()
        result_datetime = datetime.combine(
            sale_data.sale_date, current_time)
        # 1. Создаем запись о продаже
        sale = await Sales(
            user_id=current_user.id,
            sale_date=result_datetime,
            client_name=sale_data.client_name
        ).save()

        # 2. Добавляем позиции продажи и обновляем количество товаров
        for item in sale_data.items:
            # Проверяем существование товара
            product = await Products.objects().get(Products.id == item.product_id)
            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product with id {item.product_id} not found"
                )

            # Проверяем достаточное количество товара
            if product.current_quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough quantity for product {item.product_id}. Available: {product.current_quantity}, requested: {item.quantity}"
                )

            # Создаем позицию продажи
            await SaleItems(
                sale_id=sale[0]["id"],
                product_id=item.product_id,
                quantity=item.quantity
            ).save()

            # Обновляем количество товара (уменьшаем, так как это продажа)
            await Products.update({
                Products.current_quantity: Products.current_quantity -
                item.quantity
            }).where(Products.id == item.product_id).run()

        return {'details': "ok"}

    except HTTPException:
        raise  # Пробрасываем уже обработанные HTTPException
    except Exception as e:
        # В случае ошибки нет автоматического отката изменений
        raise HTTPException(
            status_code=400,
            detail=f"Error creating sale: {str(e)}"
        )
