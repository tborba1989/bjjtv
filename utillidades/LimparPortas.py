import os
import platform
import subprocess


def kill_port(port):
    system = platform.system()

    try:
        if system == "Windows":
            # Lista os processos usando a porta
            result = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True)
            for line in result.decode().split('\n'):
                if line.strip():
                    pid = line.strip().split()[-1]
                    subprocess.run(f'taskkill /PID {pid} /F', shell=True)
                    print(f'🔴 Processo {pid} encerrado na porta {port}')
        else:
            # Linux/MacOS
            result = subprocess.check_output(f'lsof -ti:{port}', shell=True)
            for pid in result.decode().split('\n'):
                if pid:
                    os.system(f'kill -9 {pid}')
                    print(f'🔴 Processo {pid} encerrado na porta {port}')
    except subprocess.CalledProcessError:
        print(f'✅ Nenhum processo encontrado na porta {port}')


def main():
    print("🚀 Limpando portas 3000 e 5000...")
    kill_port(3000)
    kill_port(5000)
    print("✅ Limpeza concluída.")


if __name__ == "__main__":
    main()
