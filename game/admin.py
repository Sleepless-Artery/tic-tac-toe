from django.contrib import admin
from .models import Game


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'player_x',
        'player_o',
        'status',
        'winner',
        'current_player',
        'created_at'
    )

    search_fields = (
        'player_x',
        'player_o',
        'winner',
    )

    list_filter = (
        'status',
        'winner',
        'created_at',
    )

    ordering = ('-created_at',)

    readonly_fields = ('board', 'created_at')

    def board_display(self, obj):
        b = obj.board
        return f"""
        {b[0]} {b[1]} {b[2]}
        {b[3]} {b[4]} {b[5]}
        {b[6]} {b[7]} {b[8]}
        """

    board_display.short_description = "Board"

    list_display += ('board_display',)
