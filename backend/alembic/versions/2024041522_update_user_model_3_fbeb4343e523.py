"""update_user_model_3

Revision ID: fbeb4343e523
Revises: ddf7c778e3a8
Create Date: 2024-04-15 18:22:51.258412

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "fbeb4343e523"
down_revision = "ddf7c778e3a8"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "user_account", sa.Column("confirmation_token", sa.String(), nullable=True)
    )
    op.add_column("user_account", sa.Column("is_active", sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("user_account", "is_active")
    op.drop_column("user_account", "confirmation_token")
    # ### end Alembic commands ###