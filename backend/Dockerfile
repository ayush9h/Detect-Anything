FROM python:3.10

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install -r requirements.txt
RUN .venv\Scripts\activate

EXPOSE 5000

CMD ["python","app.py"]