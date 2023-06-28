import React, { useState, FC, useEffect } from "react";
import "./CreateDelievery.css";

interface Feature {
    text: string;
    isSelected: boolean;
}

interface Props {
    initialFeatures: Feature[];
    onDimensionsChange: (dimensions: Dimensions) => void;
    onWeightChange: (weight: string) => void;
    onFeaturesChange: (features: Feature[]) => void;
}

interface Dimensions {
    width: string;
    length: string;
    height: string;
}

const WhatBlock: FC<Props> = ({ initialFeatures, onDimensionsChange, onWeightChange, onFeaturesChange }) => {
    const [dimensions, setDimensions] = useState<Dimensions>({
        width: "",
        length: "",
        height: "",
    });
    const [weight, setWeight] = useState("");
    const [newFeature, setNewFeature] = useState("#");
    const [features, setFeatures] = useState(initialFeatures);

    const handleNewFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.substring(0, 1) === "#") {
            setNewFeature(val);
        }
    };

    const addFeature = () => {
        if (newFeature.length > 2) { 
            const newFeatures = [...features, { text: newFeature, isSelected: true }];
            setFeatures(newFeatures);
            onFeaturesChange(newFeatures);
            setNewFeature("#");
        }
    };


    const toggleFeature = (index: number) => {
        const updatedFeatures = features.map((feature, i) =>
            i === index ? { ...feature, isSelected: !feature.isSelected } : feature
        );
        setFeatures(updatedFeatures);
        onFeaturesChange(updatedFeatures);
    };

    useEffect(() => {
        onDimensionsChange(dimensions);
    }, [dimensions]);

    useEffect(() => {
        onWeightChange(weight);
    }, [weight]);

    return (
        <>
            <div className="question-item">
                <div>
                    <label className="question-label">Dimensions:</label>
                </div>
                <div className="input-row">
                    <div className="input-container">
                        <input
                            type="number"
                            placeholder="W"
                            className="dimension-input"
                            value={dimensions.width}
                            onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                            pattern="\d{0,4}"
                            maxLength={4}
                            required
                        />
                        <span className="units-text">cm</span>
                    </div>
                    <span>x</span>
                    <div className="input-container">
                        <input
                            type="number"
                            placeholder="H"
                            className="dimension-input"
                            value={dimensions.height}
                            onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                            pattern="\d{0,4}"
                            maxLength={4}
                            required
                        />
                        <span className="units-text">cm</span>
                    </div>
                    <span>x</span>
                    <div className="input-container">
                        <input
                            type="number"
                            placeholder="L"
                            className="dimension-input"
                            value={dimensions.length}
                            onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                            pattern="\d{0,4}"
                            maxLength={4}
                            required
                        />
                        <span className="units-text">cm</span>
                    </div>
                </div>
            </div>
            <div className="question-item">
                <div>
                    <label className="question-label">Weight:</label>
                </div>
                <div className="input-row">
                    <div className="input-container">
                        <input
                            className="weight-input"
                            type="number"
                            value={weight}
                            maxLength={4}
                            pattern="\d{0,4}"
                            onChange={(e) => setWeight(e.target.value)}
                        />
                        <span className="units-text">kg</span>
                    </div>
                </div>
            </div>
            <div className="question-item">
                <div className="input-container">
                    <label className="question-label">Package features:</label>
                    <div className="input-row">
                        <input
                            className="features-input"
                            type="text"
                            value={newFeature}
                            onChange={handleNewFeatureChange} />
                        <button type="button" className="feature-button" onClick={addFeature}>Add</button>
                    </div>
                </div>
                <div className="features-list">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-item ${feature.isSelected ? "selected" : "unselected"
                                }`}
                            onClick={() => toggleFeature(index)}
                        >
                            {feature.text}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


export default WhatBlock;
