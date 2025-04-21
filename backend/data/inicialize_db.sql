CREATE TABLE IF NOT EXISTS tickers (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       pair TEXT NOT NULL,
                                       bid REAL,
                                       ask REAL,
                                       mid REAL,
                                       indexPrice REAL,
                                       low24h REAL,
                                       high24h REAL,
                                       change24h REAL,
                                       volume24h REAL,
                                       marketCap REAL,
                                       percentageChange24h REAL,
                                       time TEXT
);
CREATE TABLE IF NOT EXISTS candles (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       timestamp TEXT NOT NULL,
                                       open REAL,
                                       high REAL,
                                       low REAL,
                                       close REAL
);