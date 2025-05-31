from piccolo.engine.postgres import PostgresEngine
from piccolo.conf.apps import AppRegistry

DB = PostgresEngine(
    config={
        "host": "127.0.0.1",
        "port": 5432,
        "database": "my_db",
        "user": "postgres",
        "password": "postgres"
    }
)

APP_REGISTRY = AppRegistry(apps=[])
