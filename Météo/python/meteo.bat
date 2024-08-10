@echo off
REM Activer l'environnement virtuel
venv\Scripts\activate

REM Démarrer l'application Flask
@REM start python app.py
start C:/ProgramData/Anaconda3/python.exe D:/Cours/api/python/app.py

REM Attendre que le serveur soit prêt (vous pouvez ajuster le temps si nécessaire)
timeout /t 5

REM Lancer le navigateur avec la page locale
start http://127.0.0.1:5000

