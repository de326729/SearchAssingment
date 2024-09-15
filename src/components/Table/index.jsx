import React, { useEffect, useState } from 'react';
import './style.css';
import SearchBox from '../searchBox';
import axios from 'axios';

const baseUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const headers = {
    'x-rapidapi-key': '945cc1fc9bmsh2c9afa82ededd82p1537e0jsne7faae44c235',
    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
};

const MyTable = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);
    const [spinner, setspinner] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchItem, setSearchItem] = useState('');
    const [searchStarted, setSearchStarted] = useState(false);
    const itemsPerPage = 3;

    const startIndex = (currentPage - 1) * itemsPerPage;
    let currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);


    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (searchStarted) {
            setTimeout(() => {
                const lowercasedsearchItem = searchItem.toLowerCase();
                const filtered = data.filter(city =>
                    city.name.toLowerCase().includes(lowercasedsearchItem) ||
                    city.country.toLowerCase().includes(lowercasedsearchItem)
                );
                setFilteredData(filtered);
                setCurrentPage(1);
                setSearchStarted(false);
                setspinner(false);
            }, 1000);
        }
    }, [data, searchItem, searchStarted]);

     const callCityApi = async (url, method = 'GET', params = {}, body = {}) => {
        let completeUrl = baseUrl + url;
        const options = {
            method: method,
            url: completeUrl,
            headers: headers,
            params: params,
            data: body,
        };
    
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("API call error:", error);
            throw error;
        }
    };
    

    const fetchCities = async (retryCount = 3) => {
        const url = '/cities';

        try {
            const response = await callCityApi(url);
            setData(response.data);
            setFilteredData(response.data);
            setspinner(false);
        } catch (error) {
            if (retryCount > 0) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                return fetchCities(retryCount - 1);
            } else {
                setError(error.message);
                setspinner(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        setspinner(true);
            setSearchStarted(true);
        }
    };

    const handleSearchChange = (e) => {
        
        setSearchItem(e.target.value);
        if (e.target.value?.length === 0) {
            setFilteredData([]);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    const noData = (filteredData?.length === 0 ) || (currentItems?.length === 0);
    const searchEmpty = searchItem.trim() === '';

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredData?.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>

            <SearchBox
                value={searchItem}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
            />
            {spinner && <div className="spinner"></div>}

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Place Name</th>
                        <th>Country</th>
                    </tr>
                </thead>
                <tbody>
                    {searchEmpty && (
                        <tr>
                            <td colSpan="3">Start searching</td>
                        </tr>
                    ) }
                    { noData ? (
                        <tr>
                            <td colSpan="3">No results found</td>
                        </tr>
                    ) : (
                        currentItems.map((city, index) => (
                            <tr key={city.id}>
                                <td>{startIndex + index + 1}</td>
                                <td>{city.name}</td>
                                <td>{city.countryCode ? <img height={50} width={55} src={`https://flagsapi.com/${city.countryCode}/flat/64.png`} alt="Flag" /> : 'NA'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {!noData && filteredData?.length > 0 && (
                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage * itemsPerPage >= filteredData?.length}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyTable;
