from django.db import models

class Game(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('finished', 'Finished'),
    ]

    player_x = models.CharField(max_length=50, null=True, blank=True)
    player_o = models.CharField(max_length=50, null=True, blank=True)

    board = models.CharField(max_length=9, default='---------')

    current_player = models.CharField(max_length=1, default='X')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    winner = models.CharField(max_length=1, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player_x} vs {self.player_o}"
