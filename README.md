
# YouTube Audio for Tesla

**YouTube Audio for Tesla** is a Flask-based web application that allows users to search for YouTube videos and play their audio directly. It is designed to be lightweight and simple, leveraging Docker for easy deployment.

---
## Support

If you find this project helpful, consider supporting me on Ko-fi:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/en0o0n)

---
## Features

- **Search YouTube Videos**: Enter a search query to find YouTube videos.
- **Play Audio**: Stream audio from selected YouTube videos.
- **Dockerized**: Easy to deploy with Docker.
- **Customizable**: Configure the YouTube API key, port, and host IP.

---
## Screenshots

### Start Page
![Tesla YouTube Audio App Screenshot](https://github.com/en0o0n/youtube-audio-for-tesla/blob/main/tesla1.PNG)
### Audio Paused 
![Tesla YouTube Audio App Screenshot](https://github.com/en0o0n/youtube-audio-for-tesla/blob/main/tesla2.PNG)

---
## Prerequisites

- **YouTube API Key**: Obtain a key from the [Google Cloud Console](https://console.cloud.google.com/).
- **Docker**: Install Docker and Docker Compose on your machine:
  - [Get Docker](https://www.docker.com/products/docker-desktop/)
  - [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/en0o0n/youtube-audio-for-tesla.git
cd youtube-audio-for-tesla
```

### 2. Configure Environment Variables

Create a `.env` file in the project directory and add the following variables:

```env
APP_HOST=0.0.0.0
APP_PORT=8283
YOUTUBE_API_KEY=your_youtube_api_key
```

Replace `your_youtube_api_key` with your actual YouTube API key.

---

## Usage

### Run with Docker

#### Using `docker run`
1. Pull the Docker image
   ```bash
   docker pull en0o0n/youtube-audio-for-tesla:latest sudo 
   ```
2. Edit the .env file 

3. Build the Docker image:
   ```bash
   docker build -t youtube-audio-for-tesla .
   ```

4. Run the container:
   ```bash
   docker run -p 8283:8283 -e YOUTUBE_API_KEY=your_api_key en0o0n/youtube-audio-for-tesla:latest
   ```

5. Access the application:
   - Open your browser and go to `http://localhost:8283`.

---

#### Using Docker Compose

1. Run the application:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Open your browser and go to `http://localhost:8283`.

---

## Configuration

### Environment Variables

You can customize the application by modifying the following environment variables:

| Variable Name     | Description                          | Default Value |
|-------------------|--------------------------------------|---------------|
| `APP_HOST`        | Host IP address to bind to           | `0.0.0.0`     |
| `APP_PORT`        | Port number for the application      | `8283`        |
| `YOUTUBE_API_KEY` | YouTube API key for fetching videos  | None          |

---

## License

This project is licensed under the **MIT NonCommercial License**. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

---

## Issues

If you encounter any issues, feel free to open an issue on the [GitHub Issues Page](https://github.com/en0o0n/youtube-audio-for-tesla/issues).

---

## Acknowledgments

- Built with ❤️ using **Flask**, **Docker**, and **YouTube Data API**.

