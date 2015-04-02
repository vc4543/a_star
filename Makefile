
TARGETS = html ajax ansi offline

.DELETE_ON_ERROR:

.PHONY: help clean all $(TARGETS)


TSFILES = $(wildcard *.ts)

help:
	@echo "make help | clean | all | $(TARGETS:%=% |) ..."

clean:
	rm -f $(TSFILES:%.ts=%.js) *.map

all: $(TARGETS)

$(TARGETS): %: astar-%.js

%.js: %.ts $(TSFILES)
	tsc --out $@ $<

