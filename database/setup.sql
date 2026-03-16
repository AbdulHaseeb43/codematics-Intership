-- Run this entire script in SQL Server Management Studio
-- before starting the Node.js server for the first time

-- Create the database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'FinTrack')
BEGIN
  CREATE DATABASE FinTrack
END
GO

USE FinTrack
GO

-- Users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
  CREATE TABLE Users (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    name        NVARCHAR(100)  NOT NULL,
    email       NVARCHAR(255)  NOT NULL UNIQUE,
    password    NVARCHAR(255)  NOT NULL,
    createdAt   DATETIME2      DEFAULT GETDATE(),
    updatedAt   DATETIME2      DEFAULT GETDATE()
  )
END
GO

-- Transactions table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Transactions' AND xtype='U')
BEGIN
  CREATE TABLE Transactions (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    description NVARCHAR(255)  NOT NULL,
    amount      DECIMAL(10,2)  NOT NULL,
    category    NVARCHAR(50)   NOT NULL,
    date        DATE           NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    userId      INT            NOT NULL,
    createdAt   DATETIME2      DEFAULT GETDATE(),
    updatedAt   DATETIME2      DEFAULT GETDATE(),
    CONSTRAINT fk_transaction_user FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT chk_category CHECK (category IN (
      'food','transport','entertainment','shopping',
      'health','utilities','housing','other'
    ))
  )
END
GO

-- Budgets table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Budgets' AND xtype='U')
BEGIN
  CREATE TABLE Budgets (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    category  NVARCHAR(50)  NOT NULL,
    amount    DECIMAL(10,2) NOT NULL,
    month     INT           NOT NULL,
    year      INT           NOT NULL,
    userId    INT           NOT NULL,
    createdAt DATETIME2     DEFAULT GETDATE(),
    updatedAt DATETIME2     DEFAULT GETDATE(),
    CONSTRAINT fk_budget_user FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT uq_budget UNIQUE (userId, category, month, year)
  )
END
GO

-- Helpful indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON Transactions (userId, date DESC)
GO

CREATE INDEX IF NOT EXISTS idx_budgets_user_month
  ON Budgets (userId, month, year)
GO

PRINT 'FinTrack database setup complete.'
GO
