import React, { useState, useEffect } from 'react';
import SummaryCards from '../components/SummaryCards';
import PieChart from '../components/PieChart';
import { Box, Dialog, DialogTitle, DialogContent, Typography, IconButton, useMediaQuery, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  
import axios from 'axios';
import ItemList from '../components/ItemList';
import apiClient from '../utilis/apiClient';

export default function SummarySection({ refreshTrigger }) {
    const [summaryData, setSummaryData] = useState({});
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emis, setEmis] = useState([]);
    const [cardBills, setCardBills] = useState([]);
    const [utilities, setUtilities] = useState([]);
    const [others, setOthers] = useState([]);
    const isMobile = useMediaQuery('(max-width:600px)');


    const fetchSummaryData = async () => {
        await apiClient.get("/calculation/", { withCredentials: true }).then((response) => setSummaryData(response.data)).catch((error) => console.error("Error fetching summary data:", error));
    };
    const fetchIncomes = async () => {
        await apiClient.get("/income/", { withCredentials: true }).then((response) => setIncomes(response.data)).catch((error) => console.error("Error fetching incomes:", error));
    };
    const fetchExpenses = async () => {
        await apiClient.get("/expenses/", { withCredentials: true }).then((response) => setExpenses(response.data)).catch((error) => console.error("Error fetching expenses:", error));
    };
    const fetchEmis = async () => {
        await apiClient.get("/calculation/getemis", { withCredentials: true }).then((response) => setEmis(response.data)).catch((error) => console.error("Error fetching emis:", error));
    };
    const fetchCardBills = async () => {
        await apiClient.get("/calculation/getcreditbills", { withCredentials: true }).then((response) => setCardBills(response.data)).catch((error) => console.error("Error fetching card bills:", error));
    };
    const fetchUtilities = async () => {
        await apiClient.get("/calculation/getutilities", { withCredentials: true }).then((response) => setUtilities(response.data)).catch((error) => console.error("Error fetching utilities:", error));
    };
    const fetchOthers = async () => {
        await apiClient.get("/calculation/getothers", { withCredentials: true }).then((response) => setOthers(response.data)).catch((error) => console.error("Error fetching others:", error));
    };

    const fetchAllData = async () => {
        await fetchSummaryData();
        await fetchIncomes();
        await fetchExpenses();
        await fetchEmis();
        await fetchCardBills();
        await fetchUtilities();
        await fetchOthers();
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [refreshTrigger]);


    const handleCardClick = (key) => {
        setSelectedCard(key);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    return (
        <Box
            sx={{
                height: "100%", // Fill the parent container's height
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // Center content vertically
                alignItems: "center", // Center content horizontally
                padding: "20px",
                marginTop: "20px",
            }}
        >
            <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '20px' }}>
                Summary Section
            </Typography>
            <Divider sx={{ marginBottom: '20px' }} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '20px' : '20px',
                    alignItems: isMobile ? 'center' : 'center',
                    justifyContent: 'space-between', // Ensure equal spacing between items
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        flex: 1, // Take equal space
                        border: "2px solid",
                        borderRadius: "20px",
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: isMobile ? "300px" : "auto", // Adjust height for mobile
                    }}
                >
                    <PieChart data={summaryData} />
                </Box>
                <Box
                    sx={{
                        flex: 1, // Take equal space
                        border: "2px solid",
                        borderRadius: "20px",
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: isMobile ? "300px" : "auto", // Adjust height for mobile
                    }}
                >
                    <SummaryCards data={summaryData} onCardClick={handleCardClick} />
                </Box>
            </Box>
            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { height: '450px', maxHeight: '80vh' } }}>
                <DialogTitle>
                    {selectedCard === 'totalIncome' && 'Income List'}
                    {selectedCard === 'totalExpense' && 'Expenses List'}
                    {selectedCard === 'totalEmis' && 'EMI List'}
                    {selectedCard === 'totalCreditBlls' && 'Credit Card Bills'}
                    {selectedCard === 'totalUtilities' && 'Utilities'}
                    {selectedCard === 'otherExpenses' && 'Other Expenses'}
                    <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedCard === 'totalIncome' && <ItemList items={incomes} />}
                    {selectedCard === 'totalExpense' && <ItemList items={expenses} />}
                    {selectedCard === 'totalEmis' && <ItemList items={emis} />}
                    {selectedCard === 'totalCreditBlls' && <ItemList items={cardBills} />}
                    {selectedCard === 'totalUtilities' && <ItemList items={utilities} />}
                    {selectedCard === 'otherExpenses' && <ItemList items={others} />}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
