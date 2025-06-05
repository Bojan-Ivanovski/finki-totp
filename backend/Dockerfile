FROM python:3.13.1

WORKDIR /backend

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7777

CMD [ "python", "-m", "fastapi", "run", "main.py", "--port", "7777"]
