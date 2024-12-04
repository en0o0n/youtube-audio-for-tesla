from flask import Flask, render_template, request, jsonify
from googleapiclient.discovery import build
import subprocess
import threading
import os
import yt_dlp
import logging

app = Flask(__name__)

# Logging configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Replace with your actual API key
API_KEY = os.getenv("YOUTUBE_API_KEY", "default_api_key")

youtube = build("youtube", "v3", developerKey=API_KEY)

def search_videos(query):
    """
    Use the YouTube API to search for videos based on the user's query.
    """
    try:
        search_response = youtube.search().list(
            q=query,
            type="video",
            part="id,snippet",
            maxResults=6,
        ).execute()

        videos = []
        for search_result in search_response.get("items", []):
            video = {
                "title": search_result["snippet"]["title"],
                "id": search_result["id"]["videoId"],
                "thumbnail": search_result["snippet"]["thumbnails"]["default"]["url"],
            }
            videos.append(video)
        return videos

    except Exception as e:
        logging.error(f"Error searching videos: {e}")
        return []

@app.route("/", methods=["GET", "POST"])
def index():
    """
    Render the index page and handle video search.
    """
    videos = []
    if request.method == "POST":
        search_query = request.form.get("search_query")
        if search_query:
            videos = search_videos(search_query)
    return render_template("index.html", videos=videos)

@app.route("/play/<video_id>")
def play(video_id):
    """
    Fetch the audio URL for a YouTube video using yt-dlp.
    """
    try:
        video_url = f"https://www.youtube.com/watch?v={video_id}"

        # yt-dlp options to get the best audio stream URL
        ydl_opts = {
            "format": "bestaudio/best",
            "quiet": True,
            "noplaylist": True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            audio_url = info["url"]

        return jsonify({"status": "Audio ready", "audio_url": audio_url})

    except Exception as e:
        logging.error(f"Error fetching audio for video {video_id}: {e}")
        return jsonify({"status": "Error", "message": str(e)}), 500

if __name__ == "__main__":
    # Get the host and port from environment variables
    host = os.getenv("APP_HOST", "0.0.0.0")
    port = int(os.getenv("APP_PORT", 8283))
    app.run(host=host, port=port, debug=True)