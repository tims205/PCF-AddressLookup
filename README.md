# PCF Address Lookup 

A Power Apps Component Framework (PCF) control that uses the [Ordnance Survey Places API](https://developer.ordnancesurvey.co.uk/os-places-api) to search for and return an address value.

![Demo](/img/demo.gif)

## Installation

1. Import either the managed or unmanaged solution (found in `/|Solutions/bin/debug`)
2. Add a column to the form that will be used to display the PCF. In the below example a column has been created called 'Address Search' 
3. Add the 'Address Lookup' PCF control to the column

![Install](/img/install.png)

## Configuration

1. Provide a valid API key in the OS API Key property. A trial key can be created on the OS Places API website
2. The 'Address search' property will default to the column that you are adding the PCF to.
3. For the remaining properties, provide the fields that you want to map the returned data to. For instance on Account and Contact, the 'Line 1' property would be mapped to 'address1_line1'. For accounts, make sure the 'Address Name' property is mapped to a field as the OS Places API may return a Company Name and Department Name as well as the address.

![Install](/img/configure.png)

## OS Places API

https://apidocs.os.uk/docs/os-places-dpa-output
