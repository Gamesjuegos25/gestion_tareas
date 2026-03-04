import os
import psycopg2


def main():
    cfg = {
        'host': os.getenv('PGHOST'),
        'port': os.getenv('PGPORT'),
        'dbname': os.getenv('PGDATABASE'),
        'user': os.getenv('PGUSER'),
        'password': os.getenv('PGPASSWORD'),
        'sslmode': os.getenv('PGSSLMODE', 'require')
    }
    try:
        conn = psycopg2.connect(**cfg)
        cur = conn.cursor()
        cur.execute('SELECT version();')
        print('Connected. Postgres version:', cur.fetchone()[0])
        cur.close()
        conn.close()
    except Exception as e:
        print('Connection failed:', e)


if __name__ == '__main__':
    main()
