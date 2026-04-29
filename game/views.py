from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import render

from .models import Game
from .serializers import GameSerializer


def index(request):
    return render(request, 'index.html')


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def get_winning_cells(self, board):
        combos = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ]
        for c in combos:
            if board[c[0]] == board[c[1]] == board[c[2]] != '-':
                return c
        return []


    @action(detail=True, methods=['post'])
    def move(self, request, pk=None):
        game = self.get_object()
        position = int(request.data.get('position'))

        if game.status == 'finished':
            return Response({'error': 'Game already finished'}, status=400)

        if game.board[position] != '-':
            return Response({'error': 'Cell already taken'}, status=400)

        board = list(game.board)
        board[position] = game.current_player
        game.board = ''.join(board)

        # победа
        winning = self.get_winning_cells(board)
        if winning:
            game.status = 'finished'
            game.winner = game.current_player
            game.save()

            return Response({
                "status": "win",
                "winner": game.winner,
                "board": game.board,
                "winning_cells": winning,
                "current_player": game.current_player
            })

        if '-' not in board:
            game.status = 'finished'
            game.save()

            return Response({
                "status": "draw",
                "board": game.board
            })

        game.current_player = 'O' if game.current_player == 'X' else 'X'
        game.save()

        return Response(GameSerializer(game).data)


    @action(detail=False, methods=['get'])
    def stats(self, request):
        return Response({
            "total_games": Game.objects.count(),
            "finished_games": Game.objects.filter(status='finished').count(),
            "wins_X": Game.objects.filter(winner='X').count(),
            "wins_O": Game.objects.filter(winner='O').count(),
        })


    @action(detail=False, methods=['get'])
    def history(self, request):
        games = Game.objects.filter(status='finished').order_by('-created_at')
        return Response(GameSerializer(games, many=True).data)
