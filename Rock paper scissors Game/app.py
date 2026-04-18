import random
import os
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

CHOICES = {"rock", "paper", "scissors"}
BEATS = {"rock": "scissors", "paper": "rock", "scissors": "paper"}

score = {"user": 0, "computer": 0}


def determine_result(user: str, computer: str) -> str:
    if user == computer:
        return "draw"
    return "win" if BEATS[user] == computer else "lose"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/play", methods=["POST"])
def play():
    data = request.get_json(silent=True) or {}
    user_choice = data.get("choice", "").lower()

    if user_choice not in CHOICES:
        return jsonify({"error": "Invalid choice. Must be rock, paper, or scissors."}), 400

    computer_choice = random.choice(list(CHOICES))
    result = determine_result(user_choice, computer_choice)

    if result == "win":
        score["user"] += 1
    elif result == "lose":
        score["computer"] += 1

    return jsonify({
        "user": user_choice,
        "computer": computer_choice,
        "result": result,
        "score": dict(score),
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
