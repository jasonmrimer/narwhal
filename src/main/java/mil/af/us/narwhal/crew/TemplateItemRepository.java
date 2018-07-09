package mil.af.us.narwhal.crew;

import org.springframework.data.jpa.repository.JpaRepository;

import javax.persistence.OrderBy;
import java.util.List;

public interface TemplateItemRepository extends JpaRepository<TemplateItem, Long> {
  @OrderBy("order_int ASC")
  List<TemplateItem> findAllByTemplateId(Long templateId);
}