import pandas as pd
import matplotlib.pyplot as plt

covid_data = pd.read_csv('time_series_covid19_confirmed_global_narrow.csv').iloc[1:]
covid_data['Long'] = covid_data['Long'].astype(float)
covid_data['Lat'] = covid_data['Lat'].astype(float)
lat_lon_confirmed = covid_data[covid_data.groupby(["Lat","Long"])["Value"].transform('max').eq(covid_data["Value"])]
covid_data.plot(kind="scatter", x="Long", y="Lat", alpha=0.1)
plt.show()