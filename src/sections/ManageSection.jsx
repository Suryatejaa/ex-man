import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Tooltip,Snackbar,Alert, CardContent, useMediaQuery, Divider, Modal, TextField, Button } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import apiClient from "../utilis/apiClient";
import CloseIcon from '@mui/icons-material/Close';
import ItemList from '../components/ItemList';



export default function ManageSection({ onFormSubmit }) {
    const [openModal, setOpenModal] = useState(null); // Tracks which modal is open
    const [formData, setFormData] = useState({}); // Tracks form data
    const isMobile = useMediaQuery("(max-width:600px)");
    const [formErrors, setFormErrors] = useState({});
    const [expenseValid, setExpenseValid] = useState(false);
    const [incomeValid, setIncomeValid] = useState(false);
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false); // State for success alert
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Message for the Snackbar

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    const handleSuccess = (message) => {
        setSnackbarMessage(message);
        setIsSnackbarOpen(true);
    };



    const fetchIncomes = async () => {
        await apiClient.get("/income/", { withCredentials: true }).then((response) => setIncomes(response.data)).catch((error) => console.error("Error fetching incomes:", error));
    };

    const fetchExpenses = async () => {
        await apiClient.get("/expenses/", { withCredentials: true }).then((response) => setExpenses(response.data)).catch((error) => console.error("Error fetching expenses:", error));
    };

    useEffect(() => {
        setIncomeValid(formData.source && formData.type && formData.amount && formData.date);
    }, [formData]);

    useEffect(() => {
        setExpenseValid(formData.title && formData.amount > 0 && formData.date && formData.category && Object.keys(formErrors).length === 0);// || (formData.source && formData.type && formData.amount && formData.date))
    }, [formData, formErrors]);

    const [summaryData, setSummaryData] = useState({});

    const fetchSummaryData = async () => {
        await apiClient.get("/calculation/", { withCredentials: true }).then((response) => setSummaryData(response.data)).catch((error) => console.error("Error fetching summary data:", error));
    };


    const handleOpenModal = (type) => {
        fetchSummaryData();
        setFormData({});
        setOpenModal(type);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
        setOpenModal(null);
    };

    useEffect(() => {
        fetchExpenses();
        fetchIncomes();
    }, []);

    const handleCardClick = (key) => {
        setSelectedCard(key);
        setIsModalOpen(true);

        if (key === "deleteIncome") {
            fetchIncomes();
        } else if (key === "deleteExpense") {
            fetchExpenses();
        } else if (key === "editIncome") {
            fetchIncomes();
        } else if (key === "editExpense") {
            fetchExpenses();
        }
    };

    const balanceAmount = summaryData.balance;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'amount' && openModal === 'addExpense') {
            if (parseFloat(value) > balanceAmount) {
                setFormErrors((prev) => ({
                    ...prev,
                    amount: `You cannot spend more than your current balance ₹${balanceAmount}`,
                }));

            } else {
                setFormErrors((prev) => {
                    const { amount, ...rest } = prev; // Remove the error if validation passes
                    return rest;
                });
            }
        }

        if (name === "date" && openModal === "addExpense") {
            const selectedDate = new Date(value);
            const currentDate = new Date();

            const firstDayNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

            if (selectedDate >= firstDayNextMonth) {
                setFormErrors((prev) => ({
                    ...prev,
                    date: "Please stick to current month Expenses",
                }));
            }
            else {
                setFormErrors((prev) => {
                    const { date, ...rest } = prev;
                    return rest;
                });
            }
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const url = openModal === "addIncome"
            ? "income"
            : "expenses";
        try {
            const response = await apiClient.post(`/${url}/`, formData, { withCredentials: true });
            if (response.status === 201 || response.status === 200) {
                alert(`${openModal === "addIncome" ? "Income" : "Expense"} added successfully!`);
                handleCloseModal();
                onFormSubmit(); // Refresh the data after adding
            } else {
                alert("Failed to add data.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    };


    return (
        <Box sx={{ padding: "20px", height: "100vh", marginLeft: isMobile ? "-10px" : "-10px", marginTop: "120px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <Divider sx={{ marginBottom: "20px" }} />
            <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "20px" }}>
                Manage Income and Expenses
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "20px",
                    justifyContent: isMobile ? "center" : "space-between",
                    width: "100%",
                    marginRight: isMobile ? "20px" : "-10px",
                }}
            >
                {/* Income Box */}
                <Box
                    sx={{
                        flex: 1,
                        border: "2px solid",
                        borderRadius: "20px",
                        borderColor: "#000",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        backgroundColor: "#fff",
                        maxWidth: isMobile ? "80%" : "48%",
                        margin: isMobile ? "0 auto" : "0",
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center" }}>
                        Income
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "10px",
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "2px solid",
                                borderColor: "#000",
                                borderRadius: 5,
                                cursor: "pointer",
                                textAlign: "center",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                            onClick={() => handleOpenModal("addIncome")}
                        >
                            <CardContent>
                                <Tooltip title="Add Income" arrow>
                                    <Typography>
                                        <AddToPhotosIcon />
                                    </Typography>
                                </Tooltip>
                            </CardContent>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "2px solid",
                                borderColor: "#000",
                                borderRadius: 5,
                                cursor: "pointer",
                                textAlign: "center",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                            onClick={() => handleCardClick("editIncome")}

                        >
                            <CardContent>
                                <Tooltip title="Edit Income" arrow>
                                    <Typography>
                                        <AutoFixHighIcon />
                                    </Typography>
                                </Tooltip>
                            </CardContent>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "2px solid",
                                borderColor: "#000",
                                borderRadius: 5,
                                cursor: "pointer",
                                textAlign: "center",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                            onClick={() => handleCardClick("deleteIncome")}
                        >
                            <CardContent>
                                <Tooltip title="Delete Income" arrow>
                                    <Typography>
                                        <DeleteForeverIcon />
                                    </Typography>
                                </Tooltip>
                            </CardContent>
                        </Box>
                    </Box>
                </Box>

                {/* Expense Box */}
                <Box
                    sx={{
                        flex: 1,
                        border: "2px solid",
                        borderRadius: "20px",
                        borderColor: "#000",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        backgroundColor: "#fff",
                        maxWidth: isMobile ? "80%" : "48%",
                        margin: isMobile ? "0 auto" : "0",
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center" }}>
                        Expenses
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            gap: "10px",
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "2px solid",
                                borderColor: "#000",
                                borderRadius: 5,
                                cursor: "pointer",
                                textAlign: "center",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                            onClick={() => handleOpenModal("addExpense")}
                        >
                            <CardContent>
                                <Tooltip title="Add Expense" arrow>
                                    <Typography>
                                        <AddToPhotosIcon />
                                    </Typography>
                                </Tooltip>
                            </CardContent>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "2px solid",
                                borderColor: "#000",
                                borderRadius: 5,
                                cursor: "pointer",
                                textAlign: "center",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                            onClick={() => handleCardClick("editExpense")}

                        >
                            <CardContent>
                                <Tooltip title="Edit Expense" arrow>
                                    <Typography>
                                        <AutoFixHighIcon />
                                    </Typography>
                                </Tooltip>
                            </CardContent>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                backgroundColor: "#fff",
                                color: "#000",
                                border: "2px solid",
                                borderColor: "#000",
                                borderRadius: 5,
                                cursor: "pointer",
                                textAlign: "center",
                                "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                },
                            }}
                            onClick={() => handleCardClick("deleteExpense")}
                        >
                            <CardContent>
                                <Tooltip title="Delete Expense" arrow>
                                    <Typography>
                                        <DeleteForeverIcon />
                                    </Typography>
                                </Tooltip>
                            </CardContent>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ marginTop: "20px" }} />
            {/* Modal */}
            <Modal open={!!openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: "20px",
                        border: "2px solid #fff",
                        boxShadow: 24,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        color: "#37474f"
                    }}
                >
                    <Typography variant="h6" component="h2">
                        {openModal === "addIncome" ? "Add Income" : "Add Expense"}
                    </Typography>
                    {openModal === "addIncome" ? (
                        <>
                            <TextField
                                label="Source"
                                name="source"
                                fullWidth
                                value={formData.source || ""}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Type"
                                name="type"
                                select
                                fullWidth
                                value={formData.type || ""}
                                onChange={handleInputChange}
                                SelectProps={{ native: true }}
                            >
                                <option value=""></option>
                                <option value="salary">Salary</option>
                                <option value="business">Business</option>
                                <option value="investment">Investment</option>
                                <option value="other">Other</option>
                            </TextField>
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                fullWidth
                                value={formData.amount || ""}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.date || ""}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                value={formData.description || ""}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Next Income Date"
                                name="nextIncomeDate"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.nextIncomeDate || ""}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Frequency"
                                name="frequency"
                                select
                                fullWidth
                                value={formData.frequency || ""}
                                onChange={handleInputChange}
                                SelectProps={{ native: true }}
                            >
                                {/* <option value="">Select Frequency</option> */}
                                <option value="monthly">Monthly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="yearly">Yearly</option>
                                <option value="one-time">One-time</option>
                            </TextField>
                        </>
                    ) : (
                        <>
                            <TextField
                                label="Title"
                                name="title"
                                fullWidth
                                value={formData.title || ""}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                fullWidth
                                value={formData.amount || ""}
                                onChange={handleInputChange}
                                error={!!formErrors.amount} // Highlight the field in red if there's an error
                                helperText={formErrors.amount}
                            />
                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.date || ""}
                                onChange={handleInputChange}
                                error={!!formErrors.date} // Highlight the field in red if there's an error
                                helperText={formErrors.date}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                value={formData.description || ""}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Category"
                                name="category"
                                select
                                fullWidth
                                value={formData.category || ""}
                                onChange={handleInputChange}
                                SelectProps={{ native: true }}
                            >
                                <option value=""></option>
                                <option value="emi">EMI</option>
                                <option value="creditCard">Credit Card</option>
                                <option value="food">Food</option>
                                <option value="transportation">Transportation</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="utilities">Utilities</option>
                                <option value="other">Other</option>
                            </TextField>
                        </>
                    )}
                    {openModal === 'addIncome' ?
                        (<Button variant="contained" sx={{ bgcolor: '#37474f' }} onClick={handleSubmit} disabled={!incomeValid}>
                            Submit
                        </Button>)
                        :
                        <Button variant="contained" sx={{ bgcolor: '#37474f' }} onClick={handleSubmit} disabled={!expenseValid}>
                            Submit
                        </Button>
                    }
                </Box>
            </Modal>
            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { height: '450px', maxHeight: '80vh' } }}>
                <DialogTitle>
                    {selectedCard === 'deleteIncome' && 'Income List'}
                    {selectedCard === 'deleteExpense' && 'Expenses List'}
                    <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContent dividers>
                        {selectedCard === "deleteIncome" && <ItemList items={incomes} mode="delete" type="income" onRefresh={onFormSubmit} onClick={handleCloseModal} onSuccess={handleSuccess} />}
                        {selectedCard === "deleteExpense" && <ItemList items={expenses} mode="delete" type="expense" onRefresh={onFormSubmit} onClick={handleCloseModal} onSuccess={handleSuccess} />}
                        {selectedCard === "editIncome" && <ItemList items={incomes} mode="edit" type="income" onRefresh={onFormSubmit} onClick={handleCloseModal} onSuccess={handleSuccess} />}
                        {selectedCard === "editExpense" && <ItemList items={expenses} mode="edit" type="expense" onRefresh={onFormSubmit} onClick={handleCloseModal} onSuccess={handleSuccess} />}
                    </DialogContent>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}