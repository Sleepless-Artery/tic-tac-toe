from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Game
        fields = '__all__'

    def validate(self, data):
        player_x = data.get('player_x')
        player_o = data.get('player_o')

        if player_x and player_o and player_x.strip() == player_o.strip():
            raise serializers.ValidationError(
                "Игроки должны иметь разные имена"
            )

        return data