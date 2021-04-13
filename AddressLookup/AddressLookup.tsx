import * as React from 'react'


const axios = require('axios').default;

import {
    TagPicker,
    IBasePicker,
    ITag,
    IInputProps,
    IBasePickerSuggestionsProps
} from "office-ui-fabric-react/lib/Pickers"

import { initializeIcons } from '@fluentui/react';
initializeIcons();

export interface IAddressLookupProps {
    apiKey: string | null,
    baseUrl: string | null,
    onChange: (value?: any) => void
    onCleared: () => void;
}

const pickerProps: IInputProps = {
    onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
    onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
    'aria-label': 'Address picker',
    placeholder: 'Start typing here to search for an address...'
  };

const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
    //suggestionsHeaderText: 'Suggested addresses',
    noResultsFoundText: 'No addresses found',
    searchForMoreText: ""
  };

export function AddressLookupControl(myProps: IAddressLookupProps) {
    const picker = React.useRef<IBasePicker<ITag>>(null);
    const [loadedAddresses, setLoadedAddresses] = React.useState([]);
   
     function callApi(filterText?: string, tagList?: ITag[]): Promise<ITag[]> {

        tagList = [];
        
        pickerSuggestionsProps.searchForMoreText = "";

        // If no filterText supplied then return
        if (!filterText || filterText === "") {
            return new Promise<ITag[]>(function (resolve,reject) {
                resolve(tagList == null ? [] : tagList);
            });
        }
        
        setLoadedAddresses([]);

         return new Promise<ITag[]>(function (resolve, reject) {
             axios.get(`${myProps.baseUrl}?query=${filterText}&maxresults=50&output_srs=WGS84&key=${myProps.apiKey}`)
            .then(function (response) {
                // Save the loaded addresses so we don't have to query for the details again once a user selects one
                if (response.data.header.totalresults > 0 && response.data.results) {
                    setLoadedAddresses(response.data.results);

                    if (response.data.header.totalresults > 50) {
                        pickerSuggestionsProps.searchForMoreText = "There are more results available. Provide more information to refine the address search"
                    }

                    resolve(
                            response.data.results.map(
                                (item, index) => ({
                                // Use the DPA.ADDRESS property as a key because the UPRN and UDPRN aren't alway populated
                                key: item.DPA.ADDRESS,
                                name: item.DPA.ADDRESS 
                            })   
                        )
                    );
                } else {
                    // Return an empty array so that the picker shows the pickerSuggestionsProps.noResultsFoundText message
                    resolve([])
                }
            })
            .catch(function (error) {
                console.log(error);
                pickerSuggestionsProps.noResultsFoundText = `Error retrieving addresses: ${error.message}`
                resolve([])
            })
        });
    }

    // Used to clear the selected address and list of loaded addresses when the user clears a selected entry
    const onChange = (items?: ITag[]) => {
        if (items?.length === 0) {
            // Clear all values
            setLoadedAddresses([]);
            myProps.onCleared();
        } 
    }    

    // Find the address that was stored in loadedAddresses and pass it back to the PCF
    // UPRN and UPDRN are sometimes blank, so the concatenanted 'ADDRESS' value is used as a key
    const onItemSelected = (item: ITag | undefined) => {
        if (item != null) {
            // @ts-ignore
            myProps.onChange(loadedAddresses.filter(e => e.DPA.ADDRESS == item.key)[0]);
            return item;
        } else {
            return null;
        }
    };

    return (
        <div>
            <TagPicker
                onResolveSuggestions={callApi}
                pickerCalloutProps={pickerSuggestionsProps}
                itemLimit={1}
                pickerSuggestionsProps={pickerSuggestionsProps}
                onChange={onChange}
                onItemSelected={onItemSelected}
                inputProps={pickerProps}
                resolveDelay={250}
            />
        </div>
    )
}