export function updateMetaTags(to) {
    // Default meta tags
	const defaultMeta = {
		title: "alphabench | Test trading strategies in natural language",
		description:
			"With alphabench you can backtest and optimize trading strategies using simple conversational words",
		keywords:
			"trading strategy, backtesting, algorithmic trading, stock market, financial analysis, algorithmic trading strategies, backtesting trading strategies, investment analysis, quantitative trading, automated trading, technical analysis, financial markets, trading indicators, portfolio optimization, risk management, market analysis, trading automation, trading signals, trading performance, trading metrics, trading platform, trading tools, trading software, trading education, trading research, trading analytics, trading data, trading insights",
	};

    // Merge route meta with defaults
    const meta = {
      ...defaultMeta,
      ...to.meta
    }
  
	// Update meta tags
	document.title = meta.title;
	const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
        descriptionMeta.setAttribute("content", meta.description);
    }

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
        keywordsMeta.setAttribute("content", meta.keywords);
    }
}