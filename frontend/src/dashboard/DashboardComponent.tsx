import React, { useEffect, useRef } from 'react';
import { useDataProvider, useNotify } from 'react-admin';
import * as SurveyAnalytics from 'survey-analytics';
import { Model } from 'survey-core';
import 'survey-analytics/survey.analytics.min.css';
import {VisualizationPanel} from "survey-analytics";
import {useParams} from "react-router-dom";

const SurveyDashboard = () => {
  const { id } = useParams();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const visPanelRef = useRef<HTMLDivElement | null>(null);
  const dashboardRef = useRef<VisualizationPanel | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch survey JSON and results
        const { data: form } = await dataProvider.getOne('forms', { id: id });

        const { data: results } = await dataProvider.results(id)

        // Create survey model
        const survey = new Model(form.json);

        // Initialize visualization panel
        if (visPanelRef.current && !dashboardRef.current) {
          dashboardRef.current = new SurveyAnalytics.VisualizationPanel(
            survey.getAllQuestions(),
            results.map(r => r.data),
            {
              allowHideQuestions: false,
            }
          );
          dashboardRef.current.render(visPanelRef.current);
        }
      } catch (error) {
        notify('Error loading survey data', { type: 'error' });
        console.error(error);
      }
    };

    loadData();

    return () => {
      if (dashboardRef.current) {
        dashboardRef.current.clear();
      }
    };
  }, [id, dataProvider, notify]);

  return <div ref={visPanelRef} />;
};

export default SurveyDashboard;