import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDataProvider } from 'react-admin';
import {IVisualizationPanelOptions, VisualizationPanel} from 'survey-analytics';
import 'survey-analytics/survey.analytics.css';
import { Model } from 'survey-core';
import {yekanTheme} from "./yekan_theme";
import React from 'react';

const vizPanelOptions: IVisualizationPanelOptions = {
  allowHideQuestions: true
}

const DashboardComponent = () => {
  const { id } = useParams();
  const dataProvider = useDataProvider();
  const [vizPanel, setVizPanel] = useState<VisualizationPanel | null>(null);
  const [survey, setSurvey] = useState<Model>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [definition, results] = await Promise.all([
        dataProvider.getOne('forms', {id}),
        dataProvider.results(id)
      ]);
      setSurvey(definition.data);
      var model = new Model(definition.data.json);
      model.themeVariables['--font-family'] = "Yekan Bakh FaNum Regular"
      model.themeVariables['--font-family-secondary'] = "Yekan Bakh FaNum Regular"

      if (!vizPanel) {
          const vizPanel = new VisualizationPanel(
              model.getAllQuestions(),
              results.data.map((item: any) => typeof item === 'string' ? JSON.parse(item) : item),
              vizPanelOptions
          );
          vizPanel.locale = 'fa';
          setVizPanel(vizPanel);
      }

      if (vizPanel && containerRef.current) {
        // Clear previous render if needed
        containerRef.current.innerHTML = '';
        vizPanel.render(containerRef.current);
      }
    }
    fetchData();
  }, [vizPanel]);

  return (
      <div>
        <div id="surveyVizPanel"/>
        <div ref={containerRef}/>
      </div>
  );
};

export default DashboardComponent;