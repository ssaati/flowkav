package ir.jaryan.utils;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.util.StringUtils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class QueryParamExtractor {

    public static QueryParamWrapper extract(String filterStr, String rangeStr, String sortStr) {

        Object filterJsonOrArray;
        if (!StringUtils.hasText(filterStr)) {
            filterStr = "{}";
        }

        //https://stackoverflow.com/a/18368345
        filterStr = filterStr.replaceAll("%(?![0-9a-fA-F]{2})", "%25");
        filterStr = filterStr.replaceAll("\\+", "%2B");
        try {
            //https://stackoverflow.com/a/6926987/986160
            filterStr = URLDecoder.decode(filterStr.replace("+", "%2B"), "UTF-8")
                    .replace("%2B", "+");
        } catch (UnsupportedEncodingException e) {
        }

        filterJsonOrArray = new JSONTokener(filterStr).nextValue();
        JSONObject filter = null;
        JSONArray filterOr = null;
        if (filterJsonOrArray instanceof JSONObject) {
            filter = JSONUtils.toJsonObject(filterStr);
        }
        else if (filterJsonOrArray instanceof JSONArray){
            filterOr = JSONUtils.toJsonArray(filterStr);
        }
        JSONArray range;
        if (!StringUtils.hasText(rangeStr)) {
            rangeStr = "[]";
        }
        range = JSONUtils.toJsonArray(rangeStr);

        JSONArray sort;
        if (!StringUtils.hasText(sortStr)) {
            sortStr = "[]";
        }
        sort = JSONUtils.toJsonArray(sortStr);

        System.out.println("filter: " + filter);


        return new QueryParamWrapper(filter, filterOr, range, sort);
    }
}
