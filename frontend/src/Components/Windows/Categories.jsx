//Categories.jsx
import React,{ useState, useEffect } from 'react';
import Navbar from '../NavBar/Navbar.jsx';
import CategoryForm from '../Forms/CategoryForm.jsx';
import CardList from '../Cards/CardList.jsx';
import client from '../../apiClient.jsx';

import './Transactions.css';

const Categories = ({ handleLogout, isAdmin }) => {

    const [categories, setCategories] = useState([]);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [showFormC, setShowFormC] = useState(false);    

    useEffect(() => {
        fetchAllC();
    }, []); // El arreglo vacío asegura que esto se ejecute solo al montar el componente, aprendí por accidente y nuestro servidor recibió 389 request ;-;
    
    useEffect(() => {
        const appName = document.querySelector('meta[name="app-name"]').getAttribute('content');
        document.title = `Categories - ${appName}`;
      }, []);

    useEffect(() =>{ 
        fetchAllC();
        const background = document.querySelector('.table-container');
        if (background) {
            if (showFormC) {
                background.classList.add('blurred');
            } else {
                background.classList.remove('blurred');
            }
        }

    }, [showFormC]);
    
    const fetchAllC = async () => {
        try {   
            const responseC = await client.get('/api/categories/', {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` },
            });
            setCategories(responseC.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSaveCategory = () => {
        fetchAllC()
        setShowFormC(false)
        
    };

    const handleEditCategory = (category) => {
        setCategoryToEdit(category)
        console.log('ready to edit')
        setShowFormC(true)
    }; 

    const handleSaveEditCategory = () => {
        setCategoryToEdit(null)
        setShowFormC(false)
    };

    const handleDeleteCategory = async (categoryToDelete) => {
        const endpoint = `/api/categories/${categoryToDelete.id}/`;
        try {
            await client.delete(endpoint, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` },
            });
            console.log(`Category with ID ${categoryToDelete.id} deleted  `);

            // Tengo el mismo problema que con transaciones, voy a actualiza el estado localmente eliminando la categoría
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryToDelete.id)
            );

        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return(
    <div className="transaction" style={ isAdmin ? {backgroundColor:'transparent'} : {backgroundColor:'#6b90b7', width: '100vw', height: '100%', minHeight: '100vh', paddingTop: '80px', color: '#000000', overflow: 'auto' }}>
        {!isAdmin &&(<Navbar handleLogout={handleLogout} />)}
        <h1 style={isAdmin ? { marginTop: '0px' } : { marginTop: '30px' }}> Categories </h1>
        <br></br>

        {isAdmin ? (
            <CardList
                categories={categories}
                onDeleteCategory={handleDeleteCategory}
                onEditCategory={handleEditCategory}
                isAdmin={isAdmin}
            />
        ) : (
            <div className="card-list-wrapper" style={{ paddingBottom: '50px' }}>
                <CardList
                categories={categories}
                onDeleteCategory={handleDeleteCategory}
                onEditCategory={handleEditCategory}
                isAdmin={isAdmin}
                />
            </div>
        )}
        

        {showFormC && <CategoryForm
                        onSaveCategory ={handleSaveCategory}
                        categoryToEdit = {categoryToEdit}
                        isAdmin={isAdmin}ß
                    />
        }

    </div>

    );

}

export default Categories;