import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Sidebar from '../components/Sidebar';
import SummarySection from '../sections/SummarySection';
import ManageSection from '../sections/ManageSection';
import ReportsSection from '../sections/ReportsSection';
import SettingsSection from '../sections/SettingsSection';
import apiClient from '../utilis/apiClient';


export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("");
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const sectionRefs = useRef({
        summary: null,
        manage: null,
        reports: null,
        settings: null,
    });

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await apiClient.get('/users/me/', { withCredentials: true });
                setUserId(res.data._id);
                setUsername(res.data.username);
                setDisplayName(res.data.displayName);
                setEmail(res.data.email);
            } catch {
                console.log('Error fetching user');
            }
        }
        fetchUser();   
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.dataset.section);
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of the section is visible
        );

        Object.values(sectionRefs.current).forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            Object.values(sectionRefs.current).forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    const handleNavigate = (section) => {
        setActiveSection(section);
        sectionRefs.current[section]?.scrollIntoView({ behavior: "smooth" });
    };

    const [refreshSummary, setRefreshSummary] = useState(false);

    const handleRefreshSummary = () => {
        setRefreshSummary((prev) => !prev);
    };


    return (
        <DashboardLayout displayName={displayName} refreshTrigger={refreshSummary}>
            <Sidebar onNavigate={handleNavigate} activeSection={activeSection} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    scrollSnapType: "y mandatory",
                    overflowY: "scroll",
                    height: "100vh",
                    width: "100%",
                }}
            >
                <div
                    ref={(el) => (sectionRefs.current.summary = el)}
                    data-section="summary"
                    style={{
                        height: "100vh",
                        scrollSnapAlign: "start",
                        width: "100%",
                    }}
                >
                    <SummarySection refreshTrigger={refreshSummary} />
                </div>
                <div
                    ref={(el) => (sectionRefs.current.manage = el)}
                    data-section="manage"
                    style={{
                        height: "100vh",
                        scrollSnapAlign: "start",
                        width: "100%",
                    }}
                >
                    <ManageSection onFormSubmit={handleRefreshSummary} />
                </div>
                <div
                    ref={(el) => (sectionRefs.current.reports = el)}
                    data-section="reports"
                    style={{
                        height: "100vh",
                        scrollSnapAlign: "start",
                        width: "100%",
                    }}
                >
                    <ReportsSection />
                </div>
                <div
                    ref={(el) => (sectionRefs.current.settings = el)}
                    data-section="settings"
                    style={{
                        height: "100vh",
                        scrollSnapAlign: "start",
                        width: "100%",
                    }}
                >
                    <SettingsSection />
                </div>
            </div>
        </DashboardLayout>
    );
}