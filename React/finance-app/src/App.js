import React,{useState,useEffect} from 'react';
import api from './api';

const App = () => {
  // State to store the list of transactions
  const [transactions, setTransactions] = useState([]);

  // State to store form data
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: ''
  });

  // Function to fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/');
      setTransactions(response.data);  // Update state with fetched transactions
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Run fetchTransactions once when the component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle changes to form inputs
  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,  // Update the appropriate form field based on name
    });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission behavior

    try {
      await api.post('/transactions/', formData);  // Send POST request to create a new transaction
      fetchTransactions();  // Refresh the list of transactions
      setFormData({
        amount: '',
        category: '',
        description: '',
        is_income: false,
        date: ''
      });  // Reset form data after submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div>
    <nav className='navbar navbar-dark bg-primary'>
      <div className='container-fluid'>
        <a className='navbar-brand' href="#">Finance App</a>
      </div>
    </nav>
    <div className='container'>
      <form onSubmit={handleFormSubmit}>

        <div className='mb-3 mt-3'>
          <label htmlFor='amount' className='form-label'>
            Amount
          </label>
          <input type = 'text' className='form-control' id = 'amount' name='amount' onChange={handleInputChange} value={formData.amount}/>
        </div>

        <div className='mb-3 '>
          <label htmlFor='category' className='form-label'>
            Category
          </label>
          <input type = 'text' className='form-control' id = 'category' name='category' onChange={handleInputChange} value={formData.category}/>
        </div>

        <div className='mb-3'>
          <label htmlFor='description' className='form-label'>
            Description
          </label>
          <input type = 'text' className='form-control' id = 'description' name='description' onChange={handleInputChange} value={formData.description}/>
        </div>

        <div className='mb-3'>
          <label htmlFor='is_income' className='form-label'>
            Income?
          </label>
          <input type = 'checkbox' id = 'is_income' name='is_income' onChange={handleInputChange} value={formData.is_income}/>
        </div>

        <div className='mb-3'>
          <label htmlFor='date' className='form-label'>
            Date
          </label>
          <input type = 'text' className='form-control' id = 'date' name='date' onChange={handleInputChange} value={formData.date}/>
        </div>

        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
      <table className='table table-striped table-bordered table-hover'>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Income ?</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction)=>{
            return(
            <tr key={transaction.id}>
              <td>{transaction.amount}</td>
              <td>{transaction.category}</td>
              <td>{transaction.description}</td>
              <td>{transaction.is_income?'Yes':'No'}</td>
              <td>{transaction.date}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
  );
  
}

export default App;
