import React, { useState } from 'react';
import './MilestonesArea.css';
const Milestone = ({ leftImage, subscript, text, rightImage, completedCount, totalCount }) => {
    const progressText = `${completedCount}/${totalCount}`;
    const progressPercentage = (completedCount / totalCount) * 100;

    return (
        <div className="milestone">
            <div className="left-icon-container">
                <img src={leftImage} alt="" className="icon left-icon" />
                <span className="multiplier">{subscript}</span>
            </div>
            <div className="text">{text}</div>
            <div className="progress-bar-container">
                <div className="progress-bar-background">
                    <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="progress-text">{progressText}</div>
            </div>
            <img src={rightImage} alt="" className="icon right-icon" />
        </div>
    );
};


const MilestonesArea = () => {
    const [currentPage, setCurrentPage] = useState(0);

    // TODO: 后续用云侧数据替换
    const milestonesData = [
        {
            leftImage: '/habit.png',
            subscript: 'x10',
            text: 'Add 10 Habits',
            rightImage: '/crystal0.png',
            completedCount: 1,
            totalCount: 10
        },
        {
            leftImage: '/daily.png',
            subscript: 'x10',
            text: 'Add 10 Dailies',
            rightImage: '/crystal4.png',
            completedCount: 0,
            totalCount: 10
        },
        {
            leftImage: '/todo.png',
            subscript: 'x10',
            text: 'Add 10 Todo\'s',
            rightImage: '/crystal2.png',
            completedCount: 2,
            totalCount: 10
        },
        {
            leftImage: '/reward.png',
            subscript: 'x10',
            text: 'Add 10 Rewards',
            rightImage: '/crystal3.png',
            completedCount: 3,
            totalCount: 10
        },
        {
            leftImage: '/habit.png',
            subscript: '3+',
            text: 'Complete 3 Habits',
            rightImage: 'crystal0.png',
            completedCount: 1,
            totalCount: 3
        },
        {
            leftImage: '/daily.png',
            subscript: '3+',
            text: 'Complete 3 Dailies',
            rightImage: '/crystal4.png',
            completedCount: 0,
            totalCount: 3
        },
        {
            leftImage: '/todo.png',
            subscript: '3+',
            text: 'Complete 3 Todo\'s',
            rightImage: '/crystal2.png',
            completedCount: 2,
            totalCount: 3
        },
        {
            leftImage: '/reward.png',
            subscript: '3+',
            text: 'Gain 3 Rewards',
            rightImage: '/crystal3.png',
            completedCount: 3,
            totalCount: 3
        },
        {
            leftImage: '/habit.png',
            subscript: '3+',
            text: 'Add 3 Habit',
            rightImage: 'crystal0.png',
            completedCount: 1,
            totalCount: 3
        },
        {
            leftImage: '/daily.png',
            subscript: '3 Perfect Days',
            text: 'Completed all active Dailies on 3 days',
            rightImage: '/crystal4.png',
            completedCount: 0,
            totalCount: 3
        },
    ];

    const milestonesPerPage = 8;
    const totalPages = Math.ceil(milestonesData.length / milestonesPerPage);

    const currentMilestones = milestonesData.slice(
        currentPage * milestonesPerPage,
        (currentPage + 1) * milestonesPerPage
    );

    const leftBoxMilestones = currentMilestones.slice(0, milestonesPerPage / 2);
    const rightBoxMilestones = currentMilestones.slice(milestonesPerPage / 2);

    return (
        <div className="milestones-container">
            {leftBoxMilestones.length > 0 && (
                <div className="milestone-box">
                    {leftBoxMilestones.map((milestone, index) => (
                        <Milestone key={index} {...milestone} />
                    ))}
                </div>
            )}
            {rightBoxMilestones.length > 0 && leftBoxMilestones.length > 0 && (
                <div className="milestone-box">
                    {rightBoxMilestones.map((milestone, index) => (
                        <Milestone key={index} {...milestone} />
                    ))}
                </div>
            )}
            {milestonesData.length > milestonesPerPage && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)} className="page-btn">{"<"}</button>
                    <span className="page-number">{`${currentPage + 1}/${totalPages}`}</span>
                    <button onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)} className="page-btn">{">"}</button>
                </div>
            )}
        </div>
    );
};

export default MilestonesArea;
