const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const FILES = {
  books: path.join(DATA_DIR, 'books.json'),
  members: path.join(DATA_DIR, 'members.json'),
  issues: path.join(DATA_DIR, 'issues.json'),
};

function readData(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


function seedData() {
  const books = readData(FILES.books);
  if (books.length === 0) {
    writeData(FILES.books, [
      { id: 'B001', title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', quantity: 5, available: 5 },
      { id: 'B002', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', quantity: 3, available: 3 },
      { id: 'B003', title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'Computer Science', quantity: 4, available: 4 },
      { id: 'B004', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', quantity: 2, available: 2 },
      { id: 'B005', title: 'Design Patterns', author: 'Gang of Four', category: 'Programming', quantity: 3, available: 3 },
    ]);
  }
  const members = readData(FILES.members);
  if (members.length === 0) {
    writeData(FILES.members, [
      { id: 'M001', name: 'Alice Johnson', department: 'Computer Science', contact: 'alice@uni.edu', phone: '03001234567', issuedBooks: [] },
      { id: 'M002', name: 'Bob Smith', department: 'Mathematics', contact: 'bob@uni.edu', phone: '03007654321', issuedBooks: [] },
    ]);
  }
}
seedData();


function generateId(prefix, items) {
  const num = String(items.length + 1).padStart(3, '0');
  return `${prefix}${num}`;
}

function getDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
}

function calcFine(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  if (today <= due) return 0;
  const days = Math.floor((today - due) / (1000 * 60 * 60 * 24));
  return days * 10; // Rs 10 per day
}

app.get('/api/books', (req, res) => {
  const { search } = req.query;
  let books = readData(FILES.books);
  if (search) {
    const q = search.toLowerCase();
    books = books.filter(b =>
      b.id.toLowerCase().includes(q) ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  }
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const books = readData(FILES.books);
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author, category, quantity } = req.body;
  if (!title || !author || !category || !quantity)
    return res.status(400).json({ error: 'All fields required' });
  const books = readData(FILES.books);
  const book = {
    id: generateId('B', books),
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    quantity: parseInt(quantity),
    available: parseInt(quantity),
  };
  books.push(book);
  writeData(FILES.books, books);
  res.status(201).json(book);
});

app.put('/api/books/:id', (req, res) => {
  const books = readData(FILES.books);
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  const { title, author, category, quantity } = req.body;
  const issued = books[idx].quantity - books[idx].available;
  const newQty = parseInt(quantity) || books[idx].quantity;
  books[idx] = {
    ...books[idx],
    title: title || books[idx].title,
    author: author || books[idx].author,
    category: category || books[idx].category,
    quantity: newQty,
    available: Math.max(0, newQty - issued),
  };
  writeData(FILES.books, books);
  res.json(books[idx]);
});

app.delete('/api/books/:id', (req, res) => {
  let books = readData(FILES.books);
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (book.available !== book.quantity)
    return res.status(400).json({ error: 'Cannot delete book with active issues' });
  books = books.filter(b => b.id !== req.params.id);
  writeData(FILES.books, books);
  res.json({ message: 'Book deleted' });
});


app.get('/api/members', (req, res) => {
  const { search } = req.query;
  let members = readData(FILES.members);
  if (search) {
    const q = search.toLowerCase();
    members = members.filter(m =>
      m.id.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q)
    );
  }
  res.json(members);
});

app.get('/api/members/:id', (req, res) => {
  const members = readData(FILES.members);
  const member = members.find(m => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  res.json(member);
});

app.post('/api/members', (req, res) => {
  const { name, department, contact, phone } = req.body;
  if (!name || !department || !contact)
    return res.status(400).json({ error: 'Name, department, and contact required' });
  const members = readData(FILES.members);
  const member = {
    id: generateId('M', members),
    name: name.trim(),
    department: department.trim(),
    contact: contact.trim(),
    phone: phone || '',
    issuedBooks: [],
  };
  members.push(member);
  writeData(FILES.members, members);
  res.status(201).json(member);
});

app.put('/api/members/:id', (req, res) => {
  const members = readData(FILES.members);
  const idx = members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });
  const { name, department, contact, phone } = req.body;
  members[idx] = {
    ...members[idx],
    name: name || members[idx].name,
    department: department || members[idx].department,
    contact: contact || members[idx].contact,
    phone: phone || members[idx].phone,
  };
  writeData(FILES.members, members);
  res.json(members[idx]);
});

app.delete('/api/members/:id', (req, res) => {
  let members = readData(FILES.members);
  const member = members.find(m => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  if (member.issuedBooks.length > 0)
    return res.status(400).json({ error: 'Cannot delete member with active issues' });
  members = members.filter(m => m.id !== req.params.id);
  writeData(FILES.members, members);
  res.json({ message: 'Member deleted' });
});


app.get('/api/issues', (req, res) => {
  const issues = readData(FILES.issues);
  res.json(issues);
});

app.post('/api/issues', (req, res) => {
  const { memberId, bookId } = req.body;
  if (!memberId || !bookId)
    return res.status(400).json({ error: 'Member ID and Book ID required' });

  const books = readData(FILES.books);
  const members = readData(FILES.members);
  const issues = readData(FILES.issues);

  const bookIdx = books.findIndex(b => b.id === bookId);
  const memberIdx = members.findIndex(m => m.id === memberId);

  if (bookIdx === -1) return res.status(404).json({ error: 'Book not found' });
  if (memberIdx === -1) return res.status(404).json({ error: 'Member not found' });
  if (books[bookIdx].available <= 0)
    return res.status(400).json({ error: 'Book not available (quantity is 0)' });

  
  const alreadyIssued = issues.find(
    i => i.memberId === memberId && i.bookId === bookId && i.status === 'issued'
  );
  if (alreadyIssued)
    return res.status(400).json({ error: 'Member already has this book issued' });

  const issue = {
    id: uuidv4(),
    memberId,
    bookId,
    memberName: members[memberIdx].name,
    bookTitle: books[bookIdx].title,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: getDueDate(),
    returnDate: null,
    fine: 0,
    status: 'issued',
  };

  books[bookIdx].available -= 1;
  members[memberIdx].issuedBooks.push(bookId);
  issues.push(issue);

  writeData(FILES.books, books);
  writeData(FILES.members, members);
  writeData(FILES.issues, issues);

  res.status(201).json(issue);
});

app.post('/api/issues/:id/return', (req, res) => {
  const issues = readData(FILES.issues);
  const books = readData(FILES.books);
  const members = readData(FILES.members);

  const idx = issues.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Issue record not found' });
  if (issues[idx].status === 'returned')
    return res.status(400).json({ error: 'Book already returned' });

  const bookIdx = books.findIndex(b => b.id === issues[idx].bookId);
  const memberIdx = members.findIndex(m => m.id === issues[idx].memberId);

  const fine = calcFine(issues[idx].dueDate);
  issues[idx].status = 'returned';
  issues[idx].returnDate = new Date().toISOString().split('T')[0];
  issues[idx].fine = fine;

  if (bookIdx !== -1) books[bookIdx].available += 1;
  if (memberIdx !== -1) {
    members[memberIdx].issuedBooks = members[memberIdx].issuedBooks.filter(
      id => id !== issues[idx].bookId
    );
  }

  writeData(FILES.issues, issues);
  writeData(FILES.books, books);
  writeData(FILES.members, members);

  res.json({ ...issues[idx], fine });
});

app.get('/api/stats', (req, res) => {
  const books = readData(FILES.books);
  const members = readData(FILES.members);
  const issues = readData(FILES.issues);

  res.json({
    totalBooks: books.length,
    totalMembers: members.length,
    activeIssues: issues.filter(i => i.status === 'issued').length,
    overdueIssues: issues.filter(i => i.status === 'issued' && new Date() > new Date(i.dueDate)).length,
    totalFinesCollected: issues.filter(i => i.status === 'returned').reduce((sum, i) => sum + i.fine, 0),
    availableBooks: books.reduce((sum, b) => sum + b.available, 0),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Library API running on http://localhost:${PORT}`));
