import logging


logger = logging.getLogger(__name__)

class Base(DeclarativeBase):
    pass

engine = create_async_engine(
    settings.database_url,
    echo=setting.DEBUG,
    future=True
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)