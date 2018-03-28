package mil.af.us.narwhal.upload;

import java.util.List;

public class ImportException extends RuntimeException {
  private List<Integer> failedRows;

  public ImportException(List<Integer> failedRows) {
    this.failedRows = failedRows;
  }

  @Override
  public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append("Upload was unsuccessful.\nRow(s) ");
    for (Integer row : failedRows) {
      sb.append(row);
      sb.append(", ");
    }
    sb.replace(sb.length() - 2, sb.length(), " ");
    sb.append("contain errors.");
    return sb.toString();
  }
}
