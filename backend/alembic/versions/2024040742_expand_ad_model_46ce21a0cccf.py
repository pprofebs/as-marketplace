"""expand_ad_model

Revision ID: 46ce21a0cccf
Revises: 55763d770475
Create Date: 2024-04-07 21:42:08.540756

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "46ce21a0cccf"
down_revision = "55763d770475"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("ads", sa.Column("images", sa.String(), nullable=False))
    op.add_column("ads", sa.Column("category", sa.String(length=256), nullable=False))
    op.add_column("ads", sa.Column("condition", sa.String(length=256), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("ads", "condition")
    op.drop_column("ads", "category")
    op.drop_column("ads", "images")
    # ### end Alembic commands ###
