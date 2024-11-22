// Transactions.jsx
import React,{ useState, useEffect } from 'react';
import Navbar from '../NavBar/Navbar';
import './Transactions.css'
import axios from 'axios';
import client from '../../apiClient.jsx';

// Configuración de axios para solicitudes con CSRF
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const Transactions = ({ handleLogout }) => {

    const [transactions, setTransactions] = useState([]); // State to hold all transactions
    const [showForm, setShowForm] = useState(false); //state for showing transactions form
    const [showFormC, setShowFormC] = useState(false); //state for showing categories form
    const [transactionType, setTransactionType] = useState(''); //TYPE
    const [category, setCategories] = useState([]); //array for options *they must come from db* *distingued by type*
    const [selectedCategory, setSelectedCategory] = useState(''); //CATEGORIES
    const [isAddingCategory, setIsAddingCategory] = useState(false); //for tracking if its dropdown or field
    const [account, setAccount] = useState([]); //array for options *they must come from db*
    const [selectedAccount, setSelectedAccount] = useState(''); //ACCOUNTS
    const [isAddingAccount, setIsAddingAccount] = useState(false);//for tracking if its dropdown or field
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category_name,setCategory_name] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');

    //fetch transactions
    useEffect(() =>{ 
        const fetchAllT = async () => {
            const token = localStorage.getItem('authToken');
            try{
                const responseT = await client.get('/api/transactions', {
                    headers: {Authorization: 'Bearer ${token}'},
                });
                setTransactions(responseT.data);
            }catch(error){
                console.error('Error while fetching transactions', error);
            }
        };

        fetchAllT();
    }, []);

    //fetch categories

    //fetch accounts

    //submit for transactions
    const handleSubmit = (e) => { 
        e.preventDefault();

        const data = {
            category: selectedCategory,
            account: selectedAccount,
            amount: amount,
            description: description,
            date: date,
            type: transactionType,
        };
        setTransactions([...transactions, data]);

        const endpoint = '/api/transactions';
        client.post(endpoint,data)
        .then(() => {
            setTransactionType('');
            setAmount('');
            setDescription('');
            setDate('');
            setSelectedCategory('');
            setSelectedAccount('');
            setMessage(`${transactionType} added successfully!`);
            setShowForm(false);
            setMessage('');
          })
          .catch((error) => {
            console.error('Error while creting transaction:', error);
            setMessage('Failed to add transaction');
          });
          
    };

    //submit for categories //JUST NAME
    const handleAddCategory = () => {
        //missing logic for the type 
        const newCategory = prompt("Enter the new category name:");
        if (newCategory && !category.includes(newCategory)) {
            setCategories([...category, newCategory]);
            setSelectedCategory(newCategory);
        }
        setIsAddingCategory(false); 
    };
    //WHOLE FORM
    const handleSubmitC = (e) => { 
        e.preventDefault();

        const data = {
           isAddingCategory: true, 
           category_name: category_name,
           description: description,
           type: transactionType, 
        };
        setCategories([...category, data]);

        const endpoint = '/api/';
        client.post(endpoint,data)
        .then(() => {
            setCategory_name('');
            setDescription('');
            setMessage(`Category for ${transactionType} added successfully!`);
            setShowForm(false);
            setMessage('');
          })
          .catch((error) => {
            console.error('Error while creating category:', error);
            setMessage('Failed to add category');
          });
          
    };

    //submit for accounts //JUST NAME
    const handleAddAccount = () => {
        //missing logic for 
        const newAccount = prompt("Enter the new account name:");
        if (newAccount && !account.includes(newAccount)) {
            setAccount([...account, newAccount]);
            setSelectedAccount(newAccount);
        }
        setIsAddingAccount(false);
    };

    return (
        <div className="transaction">
          <Navbar handleLogout={handleLogout} />
          <h1>Transactions Page</h1>

          <div className="table-container">
            <div className="table-header">
                {/* Button aligned to the top left */}
                <button
                className="add-transaction"
                onClick={() => setShowForm(!showForm)}
                >
                {showForm ? 'Cancel' : '+ Add Transaction'}
                </button>
            </div>
            <div className="table-header">
                {/* Button aligned to the top left */}
                <button
                className="add-category"
                onClick={() => setShowFormC(!showFormC)}
                >
                {showFormC ? 'Cancel' : '+ Add Category'}
                </button>
            </div>

          {/* Table */}
          <table className="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Category</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.description}</td>
                <td>{transaction.date}</td>
                <td>{transaction.category}</td>
                <td>{transaction.account}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No transactions yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
        {showForm && (   
        
            <><div className="transaction-type-buttons">
                <button
                    type="button"
                    onClick={() => setTransactionType('ING')}
                    className={transactionType === 'ING' ? 'active-income' : ''}
                >
                    Income
                </button>
                <button
                    type="button"
                    onClick={() => setTransactionType('EXP')}
                    className={transactionType === 'EXP' ? 'active-expense' : ''}
                >
                    Expense
                </button>
                </div><form onSubmit={handleSubmit}>
                    <div className="transaction-form">
                        <div className="transaction-field">
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required />
                        </div>

                        <div className="transaction-field">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required />
                        </div>

                        <div className="transaction-field">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required />
                        </div>

                        {/* Category Dropdown or Input */}
                        <div className="category-dropdown">
                            <label htmlFor="category">Category</label> {/**If its true, it unchains: */}
                            {isAddingCategory ? (
                                <input
                                    type="text"
                                    placeholder="Enter new category"
                                    onBlur={(e) => handleAddCategory(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddCategory(e.target.value);
                                            e.preventDefault();
                                        }
                                    } } />
                            ) : (
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        if (e.target.value === "add_new") {
                                            setIsAddingCategory(true);
                                        } else {
                                            setSelectedCategory(e.target.value);
                                        }
                                    } }
                                >
                                    {category.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                    <option value="add_new">+ Add New Category</option>
                                </select>
                            )}
                        </div>

                        {/* Account Dropdown or Input */}
                        <div className="account-dropdown">
                            <label htmlFor="account">Account</label>
                            {isAddingAccount ? (
                                <input
                                    type="text"
                                    placeholder="Enter new category"
                                    onBlur={(e) => handleAddAccount(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddAccount(e.target.value);
                                            e.preventDefault();
                                        }
                                    } } />
                            ) : (
                                <select
                                    id="account"
                                    value={selectedAccount}
                                    onChange={(e) => {
                                        if (e.target.value === "add_new") {
                                            setIsAddingAccount(true);
                                        } else {
                                            setSelectedAccount(e.target.value);
                                        }
                                    } }

                                >
                                    {account.map((acc, index) => (
                                        <option key={index} value={acc}>{acc}</option>
                                    ))}
                                    <option value="add_new">+ Add New Account</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={!transactionType}>Add Transactions</button>
                    {message && <p className="message">{message}</p>}
                </form></>
            )}

        </div>

    );

};

export default Transactions;
